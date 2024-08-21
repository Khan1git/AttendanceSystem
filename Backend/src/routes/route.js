import express from 'express'
import { addAccount, auth, countAllstudents, deleteStudent, FindUserById, getAllusers, LoginUser, updateAccount } from '../controllers/AuthController.js'
import uploads from '../middlewares/uploads.js'
import authenticateToken from '../middlewares/auth.js'
import { countAllAttendances, countAttendanceByStatus, deleteAttendance, getAttendanceByid, markAttendance, showAllAttendance, updateAttendance } from '../controllers/AttendanceController.js'
import { countAllLeaves, deleteLeave, FetchAllLeaves, FetchLeaveById, reqLeave, updateLeaveRequest } from '../controllers/LeaveController.js'

const router = express.Router()


// ----------- THE AUTH ROUTE -------

router.post('/auth/sign-up', uploads.single('profile'), addAccount)
router.put('/auth/log-in', LoginUser)
router.get('/auth/get-all', getAllusers)
router.get('/auth/allow-me', authenticateToken, auth)
router.delete('/auth/delete/:id', deleteStudent)
router.get('/auth/findBy-id/:id', FindUserById)
router.put('/auth/updateBy-id/:id', uploads.single('profile'), updateAccount)

router.get('leave/count', countAllstudents)


// ------------------- THE ATTENDACE ROUTES ----------

router.post('/attendance/mark', markAttendance)
router.get('/show/all-attendance', showAllAttendance)
router.delete('/attendance/delete/:id', deleteAttendance)
router.get('/attendance/getbyid/:id', getAttendanceByid)
router.put('/attendance/updatebyid/:id', updateAttendance)

router.get('/attendance/count', countAllAttendances)
router.get('/attendance/count-by-status', countAttendanceByStatus)

// ---------------------- LEAVE REQ ------------------

router.post('/request/leave', reqLeave)
router.get('/request/all-leaves', FetchAllLeaves)
router.get('/request/find-leaves/:id', FetchLeaveById)
router.put('/leave-req/update/:id', updateLeaveRequest)
router.delete('/leave-req/delete/:id', deleteLeave)

router.get('leave/count', countAllLeaves)







export default router