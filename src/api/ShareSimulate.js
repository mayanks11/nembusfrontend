import { fireStore, auth } from "../firebase";
import { NotificationManager } from "react-notifications";
import $ from "jquery";
import moment from "moment";

// import shortid from 'shortid';

const SimulationInvitation = fireStore.collection("SimulationInvitation");
const Project = fireStore.collection("PROJECT");

const sendResponse = (data) => Promise.resolve(data);


export default class ShareSimulationService {

    static async createInvitationRecord(missionId,
        simulationId,
        fromUserObj,
        toUserObj,
        userData) {
        try {
            const simulationInvitationData = {
                missionId: missionId,
                simulationId: simulationId,
                fromUserObj: fromUserObj,
                toUserObj: toUserObj,
                CreatedBy: userData.Email,
                CreatedOn: new Date(),
                LastModifiedBy: userData.Email,
                LastModifiedOn: new Date(),
                IsDelete: false,
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    static async getInvitationRequests(uid) {
        try {
            console.log("uisddd", uid);
            const snapshot = await SimulationInvitation
                .where("toUserObj.userId", "==", uid)
                .where("status", "==", "pending")
                .get();

            const result = snapshot.docs.map((doc) => ({
                message: doc.data().message,
                fromUserName: doc.data().fromUserObj.userName,
                createdDate: doc.data().CreatedOn,
                id: doc.id,
                simulationId: doc.data().simulationId,
                missionId: doc.data().missionId
            }));
            console.log("result inside api", result);
            return result;
        }
        catch (error) {
            sendResponse(error);
            console.log(error)
        }
    }

    
    static async getInvitationRequestsSnapShot(uid,callback) {
        try {
            console.log("uisddd", uid);
            const snapshot = await SimulationInvitation
                .where("toUserObj.userId", "==", uid)
                .where("status", "==", "pending")
                .onSnapshot(function (snapshot) {
                    callback(snapshot);
                  });
                

            // const result = snapshot.docs.map((doc) => ({
                // message: doc.data().message,
                // fromUserName: doc.data().fromUserObj.userName,
                // createdDate: doc.data().CreatedOn,
                // id: doc.id,
                // simulationId: doc.data().simulationId,
                // missionId: doc.data().missionId
            // }));
            // console.log("result inside api", result);
            // return result;
        }
        catch (error) {
            sendResponse(error);
            console.log(error)
        }
    }

    static async fetchSharedCases() {
        try {
            const snapshot = await Project.where(`StackholderList.${auth.currentUser.uid}`, "==", "edit").get();

            const fetchCases = [];
            snapshot.forEach((doc) => {
                fetchCases.push(
                    new Promise((resolve, reject) => {
                        Project.doc(doc.id)
                            .collection("Simulation")
                            .where(`StackholderList.${auth.currentUser.uid}`, "==", "edit")
                            .get()
                            .then((snapshot) => {
                                const tempCases = [];
                                snapshot.forEach((subDoc) => {
                                    tempCases.push({
                                        missionId: doc.id,
                                        missionName: doc.data().ProjectName,
                                        missionCreatedOn: doc.data().CreatedOn,
                                        missionDescription: doc.data().Description,
                                        simulationId: subDoc.id,
                                        simulationName: subDoc.data().SimulationName,
                                        simulationCreatedOn: subDoc.data().CreatedOn,
                                        simulationLastModifiedOn:
                                            typeof subDoc.data().LastModifiedOn === "object"
                                                ? subDoc.data().LastModifiedOn
                                                : {
                                                    seconds: Math.ceil(
                                                        subDoc.data().LastModifiedOn / 1000
                                                    ),
                                                    nanoseconds:
                                                        (subDoc.data().LastModifiedOn % 1000) * 1000000,
                                                },
                                        simulationDescription: subDoc.data().SimulationDescription,
                                        simulationStartDate: subDoc.data().StartDate,
                                        simulationEndDate: subDoc.data().EndDate,
                                    });
                                });
                                resolve(tempCases);
                            })
                            .catch(reject);
                    })
                );
            });
            const cases = await Promise.all(fetchCases);

            console.log("cases");

            const result = cases.flat();
            // sorting it in descending order
            result.sort(function (a, b) {
                if (
                    a.simulationLastModifiedOn.seconds ==
                    b.simulationLastModifiedOn.seconds
                ) {
                    return (
                        b.simulationLastModifiedOn.nanoseconds -
                        a.simulationLastModifiedOn.nanoseconds
                    );
                } else {
                    return (
                        b.simulationLastModifiedOn.seconds -
                        a.simulationLastModifiedOn.seconds
                    );
                }
            });
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    static async fetchSharedStatusList(missionId, simulationId) {
        try {

            const snapshot = await SimulationInvitation
                .where("missionId", '==', missionId)
                .where("simulationId", '==', simulationId)
                .where("status", "in", ["pending", "accepted"])
                .get();
            let response = [];
            snapshot.docs.forEach((doc) => {
                response.push({
                    id: doc.id, ...doc.data()
                })
            })
            return response;
        }
        catch (err) {
            console.log(err);
        }
    }
    static async fetchSharedStatusListSnapShot(missionId, simulationId,callback) {
        try {

            const snapshot = await SimulationInvitation
                .where("missionId", '==', missionId)
                .where("simulationId", '==', simulationId)
                .where("status", "in", ["pending", "accepted"])
                .onSnapshot(function (snapshot) {
                    callback(snapshot);
                  });
                  
            //       .get();
            // let response = [];
            // snapshot.docs.forEach((doc) => {
            //     response.push({
            //         id: doc.id, ...doc.data()
            //     })
            // })
            // return response;
        }
        catch (err) {
            console.log(err);
        }
    }


    static async setSharingStatus(invitationId) {
        try {
            let invitationRef = fireStore.collection("SimulationInvitation").doc(invitationId);

            await fireStore.runTransaction(async (transaction) => {
                await transaction.update(invitationRef, { status: "rejected" });
            })
            return {
                status: "ok",
            }
        }

        catch (error) {

        }
    }
}