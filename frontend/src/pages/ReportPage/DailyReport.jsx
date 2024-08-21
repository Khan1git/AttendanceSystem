import React, { useState, useEffect, useContext } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import profile from '../../assets/profile.jpeg'
import Navbar from '../../components/navbar/Navbars'
import { UserContext } from '../../context/UserContext';


const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        padding: 20,
        fontSize: '10px'
    },
    user_information: {
        marginLeft: 10,
        gap: '1rem',
        textAlign: "center",
        height: '14%',
        // border: '1px solid red',
        fontSize: 10
    },
    line: {
        display: 'flex',
        gap: '1rem',
        width: '100%',
        border: '1px solid grey',
    },
    section: {
        flexGrow: 1,
    },
    companyDetails: {
        marginBottom: 20,
        textAlign: 'center'
    },
    invoiceDetails: {
        display: 'flex',
        textAlign: 'start',
        width: '100%',
    },
    part2: {
        display: 'flex',
        flexDirection: 'row',
        height: '20%',
        // border: '1px solid red',
        justifyContent: 'center',
        marginBottom: 10,
    },
    heading: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        // fontSize: 16,
        marginBottom: 10,
        textDecoration: 'underline',
        textAlign: 'center',
        fontSize: '20px'
    },
    table: {
        display: 'table',
        width: '100%',
        // borderStyle: 'solid',
        border: 1,
        margin: 10,
    },
    tableRow: {
        flexDirection: 'row',
        // border: .3,

    },
    tableCellHeader: {
        padding: 7,
        // borderStyle: 'solid',
        // borderLeft: 1,
        borderRight: 1,
        // borderTop: 1,
        // borderWidth: '1px solid black',
        textAlign: 'center',
        fontSize: '12px',
        // borderBottom: 1,
        width: "100%",
    },
    tableCell: {
        padding: 5,
        width: "100%",
        fontSize: '10px',
        textAlign: 'center',
        borderRight: 1,
        borderTop: 1,
        // borderWidth: '1px solid grey',

    },
    amount: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingRight: '10%',
        // textAlign: 'center',
        // gap: '90px'
        marginTop: '-8px',
        // margin: '1px'
    },
    total_amount: {
        display: 'flex',
        flexDirection: 'row',
        // alignItems: 'center',
    },
    price: {
        border: 1,
        // fontWeight: 'bold',
        width: '22.4%',
        backgroundColor: '#edece8',
        marginLeft: '2%',
        marginRight: '-13%',
        textAlign: 'center',
        padding: '4px',
        // margin: "1px"
    },
    words: {
        // marginTop: '40px',
        // textDecoration: 'underline',
        fontSize: '12px',
        margin: '3px',
        borderStyle: 'solid'
    },
    cash: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingRight: '10%',
        // textAlign: 'center',
        // gap: '90px'
        marginTop: '1px',
        // margin: "1rem"
    },
    logo: {
        height: '100%',
        borderRadius: '50px',
    }
});

const DailyReport = () => {
    const { user } = useContext(UserContext)
    const { id } = useParams()
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [Present, setPresent] = useState(0)
    const [useDate, setUserData] = useState([])


    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/get-all', {
                method: "GET",
            });
            const result = await response.json();
            setStudents(result);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch attendance data
    const fetchAttendance = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/show/all-attendance', {
                method: "GET",
            });
            const result = await response.json();
            const todayDate = format(new Date(), 'yyyy-MM-dd');

            const todayAttendance = result.filter(item => {
                const itemDate = format(parseISO(item.date), 'yyyy-MM-dd');
                return itemDate === todayDate;
            });
            const presentCount = todayAttendance.filter(item => item.status === 'Present').length;
            const absentCount = todayAttendance.filter(item => item.status === 'Absent').length;
            const leaveCount = todayAttendance.filter(item =>
                item.status === 'Rejected' ||
                item.status === 'Approved'
            ).length;
            setPresent(absentCount)


            setAttendanceData(todayAttendance);
        } catch (error) {
            console.log(error);
        }
    };

    // Combine students and attendance data
    const combineData = () => {
        return students.map(student => {
            const studentAttendance = attendanceData.find(att => att.userId === student._id);
            return {
                ...student,
                attendanceStatus: studentAttendance ? studentAttendance.status : 'Leave', // Default to 'Leave' if no attendance found
            };
        });
    };

    useEffect(() => {
        fetchStudents();
        fetchAttendance();
    }, []);


    function generateInvoice() {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <View style={styles.companyDetails}>
                            <Text style={styles.heading}>Attendance System</Text>
                            <Text style={styles.para}>students Attendance Daily Report</Text>
                            <Text style={styles.para}>Date: {format(new Date(), 'yyyy-MM-dd')}</Text>
                        </View>
                        <View style={styles.invoiceDetails}>
                            {/* <View style={styles.user_information}>
                                        <Text>Student Name : {''} </Text>
                                        <Text>Student Email: {''}</Text>
                                        <Text>Student Dob: {'N/A'}</Text>
                                        <Text>Total Grades: A+</Text>
                                    </View> */}
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCellHeader}>No</Text>
                                    <Text style={styles.tableCellHeader}>Name</Text>
                                    <Text style={styles.tableCellHeader}>Date</Text>
                                    <Text style={styles.tableCellHeader}>Type</Text>
                                    <Text style={styles.tableCellHeader}>Status</Text>
                                    {/* <Text style={styles.tableCellHeader}>Discount/item</Text> */}
                                    {/* <Text style={styles.tableCellHeader}>Total Leaves</Text> */}
                                </View>
                                {combineData().map((student, index) => (
                                    <View style={styles.tableRow} >
                                        <Text style={styles.tableCell}>{index + 1}</Text>
                                        <Text style={styles.tableCell}>{student.name}</Text>
                                        <Text style={styles.tableCell}>{format(new Date(), 'yyyy-MM-dd')}</Text>
                                        <Text style={styles.tableCell}>{student.attendanceStatus}</Text>
                                        <Text style={styles.tableCell}>{2}</Text>
                                        {/* <Text style={styles.tableCell}>{2}</Text> */}
                                        {/* <Text style={styles.tableCell}>{2}</Text> */}
                                    </View>
                                ))}
                            </View>
                            {/* <View style={styles.amount}>
                                <Text style={styles.total_amount}>Total Grades </Text>
                                <Text style={styles.price}>A</Text>
                            </View> */}
                            {/* <View style={styles.words}>
                                <Text>Amount In Words: only</Text>
                            </View> */}
                        </View>
                    </View>
                </Page>
            </Document>
        );
    }

    return (
        <>
            <Navbar />
            <PDFViewer style={{ width: '98vw', height: '100vh', backgroundColor: "black" }}>
                {generateInvoice()}
            </PDFViewer>
        </>
    );
};

export default DailyReport;