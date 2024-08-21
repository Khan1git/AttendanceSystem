import mongoose from 'mongoose'

const leaveRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Signup',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now,
        // required: true
    },
    endDate: {
        type: Date,
        default: Date.now,
        // required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
        // required: true
    }
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;
