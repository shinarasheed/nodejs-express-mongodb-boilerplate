import Tour from '../models/tourModel';

//limi: we can choose the number of the resource we want
//filter: we can return some resouces based on some condition.
//this is like using the where clause in SQL

const getAllTours = async (req, res) => {
  try {
    //FILTER

    //$geoWithin and $geoIntersects are two geoJSON operators

    // {difficulty: 'medium', ratingsQuantity: { $gt: '6' }};

    // const tours = await Tours.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('medium');

    const query = req.query;
    const reqQuery = { ...req.query };
    const removeFields = ['sort', 'limit', 'page', 'select'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    console.log(reqQuery);

    const tours = await Tour.find(query);

    res.status(200).json({ count: tours.length, tours });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'server error' });
  }
};

export default {
  getAllTours,
};
