import crypto from 'crypto';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import Email from '../utils/email';
import { signToken, createAndSendToken } from '../utils/token';

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  const passwordIsMatch = await user.correctPassword(password, user.password);
  if (!passwordIsMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  //I could have done this for the above two lines
  //   if (!user || !(await user.comparePassword(password, user.password))) {
  //     return next(new AppError('Invalid credentials', 401));
  //   }

  createAndSendToken(user, 200, res);
});

const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

const forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  //validateBeforeSave will deactivate the validators

  //save the user so that you can save the resetToken too
  await user.save({ validateBeforeSave: false });

  //send token to user's eamail
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetpassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({ status: 'success', message: 'Token sent to email' });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later')
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  //1 get user based on the token

  //hash the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2 if token has not expired and there is a user, set the new password

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  //3 update changedPasswordAt property of the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //4 log the user in. SEND JWT
  createAndSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  //1 get user
  const user = await User.findById(req.user.id).select('+password');
  // const user = await User.findOne({ _id: req.user.id }).select('+password');

  const { passwordCurrent, password, passwordConfirm } = req.body;

  if (!user) {
    return next(new AppError('user not found', 404));
  }

  //2 check if current password is correct
  const passwordIsMatch = await user.correctPassword(
    passwordCurrent,
    user.password
  );
  if (!passwordIsMatch) {
    return next(new AppError('Invalid password', 401));
  }

  //3 if so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  //4 log the user in. SEND JWT
  createAndSendToken(user, 200, res);
});

module.exports = {
  signup,
  login,
  logout,
  forgetPassword,
  resetPassword,
  updatePassword,
};
