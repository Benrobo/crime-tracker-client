
const { hostname, protocol } = window.location

const apiRoutes = {
    userAuth: `${protocol}//localhost:5000/api/auth/officer/register`,
    adminAuth: `${protocol}//localhost:5000/api/auth/admin_auth/register`,
    logIn: `${protocol}//localhost:5000/api/auth/users/logIn`,
    approveRegRequest: `${protocol}//localhost:5000/api/users/request/registeration`,
    rejectRegRequest: `${protocol}//localhost:5000/api/users/request/registeration/reject`,
    addCase: `${protocol}//localhost:5000/api/cases/add`,
    getCases: `${protocol}//localhost:5000/api/cases/all`,
    editCase: `${protocol}//localhost:5000/api/cases/edit`,
    deleteCase: `${protocol}//localhost:5000/api/cases/delete`,
    getOfficers: `${protocol}//localhost:5000/api/officers/all`,
    getOfficersId: `${protocol}//localhost:5000/api/officers/id`,
    editOfficer: `${protocol}//localhost:5000/api/officers/edit`,
    deleteOfficer: `${protocol}//localhost:5000/api/officers/delete`,
    addPrediction: `${protocol}//localhost:5000/api/prediction/add`,
    editPrediction: `${protocol}//localhost:5000/api/prediction/edit`,
    deletePrediction: `${protocol}//localhost:5000/api/prediction/delete`,
    allSuspects: `${protocol}//localhost:5000/api/suspects/getAll`,
    getSuspects: `${protocol}//localhost:5000/api/suspects/fetch`,
    addSuspects: `${protocol}//localhost:5000/api/suspects/add`,
    editSuspects: `${protocol}//localhost:5000/api/suspects/edit`,
    deleteSuspects: `${protocol}//localhost:5000/api/suspects/delete`,
}

export default apiRoutes
