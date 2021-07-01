import fs from 'fs';
import 'colors';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

//load models
import Tour from './models/tourModel';

//connect to DB
connectDB();

//Read JSON files
const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8')
);

//import into DB
const importData = async () => {
  try {
    await Tour.create(tours, { validateBeforeSave: false });

    console.log('Data Imported...'.green.inverse);
    //exit from the process
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await Tour.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    //exit from the process
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
