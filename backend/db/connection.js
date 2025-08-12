import mongoose from "mongoose";
const URI =
  "mongodb+srv://testAppDB:testAppDB@cluster0.pl76suk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export const dataBaseConnection = async () => {
  try {
    await mongoose.connect(URI);
    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.log(error);
  }
};
