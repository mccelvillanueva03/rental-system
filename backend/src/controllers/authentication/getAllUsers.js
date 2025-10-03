import User from "../../models/User.js";

async function getAllUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers controller:".error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export default getAllUsers;
