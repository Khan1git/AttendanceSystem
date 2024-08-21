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

const Report = () => {
    const { user } = useContext(UserContext)
    const { id } = useParams()
    const [userData, setUserData] = useState([])
    const [userAttendances, setUserAttendences] = useState([])
    const [studentLeaves, setStudentLeaves] = useState([])
    const [todayattendance, setAttendance] = useState([])
    const [leave, setLeave] = useState('')


    // ------------ FETCH USER INFORMATION BY ID

    const getUserInformationByid = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/auth/findBy-id/${id}`, {
                method: "GET"
            })
            const result = await response.json()
            setUserData(result)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { getUserInformationByid() }, [id])

    const FetchAttendance = async () => {

        try {

            const response = await fetch('http://localhost:3000/api/show/all-attendance', {
                method: "GET"
            });
            const result = await response.json();
            const userAttendances = result?.filter(item => item.userId === id);
            setUserAttendences(userAttendances);

            const todayDate = format(new Date(), 'yyyy-MM-dd');
            const todayAttendance = result.find(item => {
                const itemDate = format(parseISO(item.date), 'yyyy-MM-dd');
                return itemDate === todayDate && item.userId === id;
            });
            setAttendance(todayAttendance)

        } catch (error) {
            console.log(error);
        }
    };

    // 2____ FETHCING LEAVES 

    const FetchLeaveRequests = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/request/all-leaves', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const result = await response.json();
                const totalLeaves = result?.filter(item => item.userId === id)
                setStudentLeaves(totalLeaves)

                const todayDate = format(new Date(), 'yyyy-MM-dd');
                const todayLeave = result.find(item => {
                    const leaveStartDate = format(parseISO(item.startDate), 'yyyy-MM-dd');
                    const leaveEndDate = format(parseISO(item.endDate), 'yyyy-MM-dd');
                    return todayDate >= leaveStartDate && todayDate <= leaveEndDate && item.userId.toString() === id.toString();
                });
                setLeave(todayLeave || null);
            } else {
                console.error('Failed to fetch leave requests. Response not okay.');
            }
        } catch (error) {
            console.error('Network or server error:', error);
        }
    };


    useEffect(() => {
        if (user && user._id) {
            FetchAttendance();
            FetchLeaveRequests();
        } else {
            console.log('User is not available.');
        }
    }, [user]);

    const combinedData = [
        ...userAttendances.map(attendance => ({ ...attendance, type: 'attendance' })),
        ...studentLeaves.map(leave => ({ ...leave, type: 'leave' }))
    ];
    // console.log(combinedData)




    function generateInvoice() {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <View style={styles.companyDetails}>
                            <Text style={styles.heading}>Welcome To Attendance System</Text>
                            <Text style={styles.para}>Reports for students</Text>
                        </View>
                        <View style={styles.invoiceDetails}>
                            <View style={styles.part2}>
                                <Image source={{ uri: userData.profile }} style={styles.logo} />
                            </View>
                            {
                                userData && (
                                    <View style={styles.user_information}>
                                        <Text>Student Name : {userData.name} </Text>
                                        <Text>Student Email: {userData.email}</Text>
                                        <Text>Student Dob: {userData && userData.dob ? format(parseISO(userData.dob), 'yyyy-MMM-dd') : 'N/A'}</Text>
                                        <Text>Total Grades: A+</Text>
                                    </View>
                                )
                            }

                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCellHeader}>No</Text>
                                    <Text style={styles.tableCellHeader}>Date</Text>
                                    <Text style={styles.tableCellHeader}>Type</Text>
                                    <Text style={styles.tableCellHeader}>Status</Text>
                                    {/* <Text style={styles.tableCellHeader}>Discount/item</Text> */}
                                    {/* <Text style={styles.tableCellHeader}>Total Leaves</Text> */}
                                </View>
                                {combinedData.map((item, index) => (
                                <View style={styles.tableRow} >
                                    <Text style={styles.tableCell}>{index +1}</Text>
                                    <Text style={styles.tableCell}>{item && item.date || item.startDate? format(parseISO(item.date ||item.startDate), 'yyyy-MM-dd') : 'N/A'}</Text>
                                    <Text style={styles.tableCell}>{item.status === 'Pending' || item.status === 'Approved' || item.status === 'Rejected' ? 'Leave Request' : "Attendence"}</Text>
                                    <Text style={styles.tableCell}>{item.status}</Text>
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

export default Report;