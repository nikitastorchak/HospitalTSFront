import api from "../http";

export default class UserService{
    static async ActionGetAppointments() {
        
        return api.get(`/show?token=${localStorage.getItem('token')}`);
    }
}