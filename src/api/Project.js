import { fireStore, auth } from "../firebase";
import { getTheDate, convertDateToTimeStamp } from "../helpers/helpers";
import moment from "moment";
import { SATELLITE_COLLECTION } from "Util/constants";


const projectRef = fireStore.collection('PROJECT')

class Project {
    static Collection = fireStore.collection('StackHolder');
    static async ownProjects() {

        console.log('fetch my own prjects');
        try {
            const { email } = auth ? auth.currentUser : {};

            const totalSnapshot = await projectRef
                .where('IsDelete', '==', false)
                .where(`StackholderList.${auth.currentUser.uid}`, 'in', [
                    'admin',
                    'edit',
                    'read'
                ])
                .get();

            const ownSnapshot = await projectRef
                .where('IsDelete', '==', false)
                .where(`StackholderList.${auth.currentUser.uid}`, 'in', [
                    'admin',
                    'edit',
                ])
                .get();


            let total = totalSnapshot.size
            let own = ownSnapshot.size
            console.log(total)
            const result = {
                own,
                member: total - own,
            };
            console.log("Owner is", result)
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }

    static async getWritableProjectsAndSatellite() {
      try {
        const satelliteCollectionRef = fireStore.collection(SATELLITE_COLLECTION);
        const projectsQuerySnapshot = await projectRef
          .where("IsDelete", "==", false)
          .where(`StackholderList.${auth.currentUser.uid}`, "in", [
            "admin",
            "write",
            "edit"
          ])
          .get();
        let projectsWithSatellites = new Array();
        if (!projectsQuerySnapshot.empty) {
          projectsQuerySnapshot.forEach(projectDoc => {
            projectsWithSatellites.push({
              ProjectId: projectDoc.id,
              ...projectDoc.data(),
              satellites: []
            });
          });
          for (const project of projectsWithSatellites) {
            const satelliteQuerySnapshot = await satelliteCollectionRef
              .where("IsDelete", "==", false)
              .where("ProjectDocumentID", "==", project.ProjectId)
              .get();
            if (!satelliteQuerySnapshot.empty) {
              satelliteQuerySnapshot.forEach(satelliteDoc => {
                project.satellites.push({
                  SatelliteId: satelliteDoc.id,
                  ...satelliteDoc.data()
                });
              });
            }
          }
        }
        console.log("projectsWithSatellites:", projectsWithSatellites);
        return projectsWithSatellites;
      } catch (err) {
        console.log(err);
      }
    }

// Latest Assigned Task
  static async latestTasks() {
    try {
      const { email } = auth && auth.currentUser ? auth.currentUser : { email: " " };
      console.log("got mail:--", auth.currentUser.uid, typeof email);
      const currentDate = moment()
        .utc()
        .format("YYYY-MM-DD");
      const start = new Date(currentDate);
      console.log("TIMEEEEEEEEEEEEEEE", currentDate, start);
      const snapshot = await fireStore
        .collection("Task")
        .where("IsDelete", "==", false)
        .where("Status", "==", "assigned")
        .where("DueDate", ">=", start)
        .where("TaskAssigneeList", "array-contains-any", [auth.currentUser.uid])
        .get();
      console.log("snap:---", snapshot);
      const result = [];
      const promises = [];
      
      snapshot.forEach((doc) => {
        promises.push(
          new Promise((resolve) => {
            resolve({
              ...doc.data(),
              "Due Date": moment(doc.data()["DueDate"].seconds * 1000)
                .local()
                .format("YYYY-MM-DD HH:mm:ss"),
              CreatedAt: moment(doc.data()["CreatedOn"].seconds * 1000)
                .local()
                .format("YYYY-MM-DD HH:mm:ss"),
            });
          })
        );
      });
      return await Promise.all(promises);
    } catch (err) {
      console.log(err);
    }
  }

// In-progress Task
  static async Inprogresstask() {
    try {
      const { email } = auth && auth.currentUser ? auth.currentUser : { email: " " };
      console.log("got mail:--", auth.currentUser.uid, typeof email);
      const currentDate = moment()
        .utc()
        .format("YYYY-MM-DD");
      const start = new Date(currentDate);
      console.log("TIMEEEEEEEEEEEEEEE", currentDate, start);
      const snapshot = await fireStore
        .collection("Task")
        .where("IsDelete", "==", false)
        .where("Status", "==", "in-progress")
        .where("DueDate", ">=", start)
        .where("TaskAssigneeList", "array-contains-any", [auth.currentUser.uid])
        .get();
      console.log("snap:---", snapshot);
      const result = [];
      const promises = [];
      
      snapshot.forEach((doc) => {
        promises.push(
          new Promise((resolve) => {
            resolve({
              ...doc.data(),
              "Due Date": moment(doc.data()["DueDate"].seconds * 1000)
                .local()
                .format("YYYY-MM-DD HH:mm:ss"),
              CreatedAt: moment(doc.data()["CreatedOn"].seconds * 1000)
                .local()
                .format("YYYY-MM-DD HH:mm:ss"),
            });
          })
        );
      });
      return await Promise.all(promises);
    } catch (err) {
      console.log(err);
    }
  }

// Due Tasks
  static async DueTasks() {
    try {
      const { email } = auth && auth.currentUser ? auth.currentUser : { email: " " };
      console.log("got mail:--", auth.currentUser.uid, typeof email);
      const currentDate = moment()
        .utc()
        .format("YYYY-MM-DD");
      const start = new Date(currentDate);
      console.log("TIMEEEEEEEEEEEEEEE", currentDate, start);
      const snapshot = await fireStore
        .collection("Task")
        .where("IsDelete", "==", false)
        .where("Status", "==", "assigned")
        .where("DueDate", "<", start)
        .where("TaskAssigneeList", "array-contains-any", [auth.currentUser.uid])
        .get();
      console.log("snap:---", snapshot);
      const result = [];
      const promises = [];
      
      snapshot.forEach((doc) => {
        promises.push(
          new Promise((resolve) => {
            resolve({
              ...doc.data(),
              "Due Date": moment(doc.data()["DueDate"].seconds * 1000)
                .local()
                .format("YYYY-MM-DD HH:mm:ss"),
              CreatedAt: moment(doc.data()["CreatedOn"].seconds * 1000)
                .local()
                .format("YYYY-MM-DD HH:mm:ss"),
            });
          })
        );
      });
      return await Promise.all(promises);
    } catch (err) {
      console.log(err);
    }
  }


  static async latestTasks_old() {
    try {
      const { email } =
        auth && auth.currentUser ? auth.currentUser : { email: " " };
      console.log("got mail:--", auth.currentUser.uid, typeof email);
      const currentDate = moment()
        .utc()
        .format("YYYY-MM-DD");

      const start = new Date(currentDate);

      console.log("TIMEEEEEEEEEEEEEEE", currentDate, start);

      const snapshot = await fireStore
        .collection("Task")
        .where("IsDelete", "==", false)
        .where("Status", "==", "assigned")
        .where("DueDate", ">=", start)
        .where("TaskAssigneeList", "array-contains-any", [auth.currentUser.uid])
        .get();

      console.log("snap:---", snapshot);

      const snapshot_progress = await fireStore
        .collection("Task")
        .where("IsDelete", "==", false)
        .where("Status", "==", "in-progress")
        .where("DueDate", ">=", start)
        .where("TaskAssigneeList", "array-contains-any", [auth.currentUser.uid])
        .get();


      const result = [];
      const promises = [];

      snapshot.forEach((doc) => {
        promises.push(
          new Promise((resolve) => {
            resolve({
              ...doc.data(),
              "Due Date": moment(doc.data()["DueDate"].seconds * 1000)
                .local()
                .format("YYYY-MM-DD HH:mm:ss"),
              CreatedAt: moment(doc.data()["CreatedOn"].seconds * 1000)
                .local()
                .format("YYYY-MM-DD HH:mm:ss"),
            });
          })
        );
      });

      snapshot_progress.forEach((doc) => {
        promises.push(
          new Promise((resolve) => {
            resolve({
              ...doc.data(),
              "Due Date": moment(doc.data()["DueDate"].seconds * 1000)
                .local()
                .format("YYYY-MM-DD HH:mm"),
              CreatedAt: moment(doc.data()["CreatedOn"].seconds * 1000)
                .local()
                .format("YYYY-MM-DD HH:mm"),
            });
          })
        );
      });

            return await Promise.all(promises);
        }
        catch (err) {
            console.log(err);
        }
    }

    static async projectList() {
        console.log('fetch my own prjects');
        try {
            const { email } = auth ? auth.currentUser : {};
            console.log('uid : ', email);
            const ownSnapshot = await this.Collection
                .where('EmailId', '==', email)
                .where('Permission', '==', 'Admin')
                .get();
            const totalSnapshot = await this.Collection
                .where('EmailId', '==', email)
                // .where('Permission', '==', 'Admin')
                .get();
            let total = totalSnapshot.size
            let own = ownSnapshot.size
            const result = {
                own,
                member: total - own,
            };
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
}

export default Project;