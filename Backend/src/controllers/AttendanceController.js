import Attendance from "../models/AttendanceModel.js"


export const markAttendance = async (req, res) => {
    try {
        const { userId, date, status, } = req.body;
        const existingAttendance = await Attendance.findOne({ userId, date });

        if (existingAttendance) {
            return res.status(400).json({
                message: "Attendance for this date has already been marked."
            });
        }

        const newAttendance = new Attendance(req.body);
        await newAttendance.save();

        res.status(200).json({
            message: "Attendance marked successfully.",
            attendance: newAttendance
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while marking attendance.",
            error: error.message
        });
    }
};

export const showAllAttendance = async(req, res)=>{
    try {
        const result = await Attendance.find()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

export const deleteAttendance = async(req, res)=>{
    try {
        const response = await Attendance.findByIdAndDelete(req.params.id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const getAttendanceByid = async(req, res)=>{
    try {
        const response = await Attendance.findById(req.params.id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const updateAttendance = async(req, res)=>{
    try {
        const response = await Attendance.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const countAllAttendances = async (req, res) => {
    try {
      const totalAttendanceCount = await Attendance.countDocuments({});
      res.status(200).json({ count: totalAttendanceCount });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while counting attendance documents", error: error });
    }
  };