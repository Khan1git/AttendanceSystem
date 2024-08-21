import LeaveRequest from "../models/LeaveModel.js"


export const reqLeave = async (req, res) => {
    try {
        const { userId, startDate, endDate, reason, status } = req.body;

        // Create a new leave request
        const leaveRequest = new LeaveRequest({
            userId,
            startDate,
            endDate,
            reason,
            status
        });

        // Save the leave request to the database
        await leaveRequest.save();

        // Send success response
        res.status(200).json({
            message: "Leave request sent successfully.",
            leaveRequest
        });
    } catch (error) {
        console.error('Error processing leave request:', error);
        res.status(500).json({
            message: "An error occurred while processing the leave request.",
            error: error.message
        });
    }
};


export const FetchAllLeaves = async (req, res) => {
    try {
        const response = await LeaveRequest.find()
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}


export const FetchLeaveById = async (req, res) => {
    try {
        const response = await LeaveRequest.findById(req.params.id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const updateLeaveRequest = async (req, res) => {
    try {
        const response = await LeaveRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!response) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error updating leave request:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
}

export const deleteLeave = async(req, res)=>{
    try {
        const response = await LeaveRequest.findByIdAndDelete(req.params.id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const countAllLeaves = async (req, res) => {
    try {
      const totalLeaveCount = await LeaveRequest.countDocuments({});
      res.status(200).json({ count: totalLeaveCount });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while counting attendance documents", error: error });
    }
  };