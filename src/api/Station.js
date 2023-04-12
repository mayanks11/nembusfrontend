import { fireStore, auth } from '../firebase';

class Station {
    static Collection = fireStore.collection('Station');
    // static async ModelList() {
    //     console.log('fetch my own prjects');
    //     try {
    //         // const email = auth.currentUser.email;
    //         // console.log('uid : ', email);
    //         const userDocRef = fireStore.collection('users').doc('QT2C2Yub7GYuhvBkgb4k')
    //         const snapshot = await this.Collection.where('Downloadedby','==',userDocRef).get();
    //         let promises = []
    //         console.log("AI:--",snapshot);
            
    //         snapshot.forEach(doc => {
    //             console.log("doc:",doc.data());
                
    //             promises.push(new Promise((resolve) => {
    //                 resolve({ ...doc.data(),a: doc.data().ProjectId.get(), id: doc.id})
    //             }));
    //         });
    //         return await Promise.all(promises);
    //     }
    //     catch(err) {
    //         console.log(err);
    //     }
    // }
    static async ModelList() {
        console.log('fetch my own prjects');
        try {
            // const email = auth.currentUser.email;
            // console.log('uid : ', email);
            // const userDocRef = fireStore.collection('users').doc('QT2C2Yub7GYuhvBkgb4k')
            const snapshot = await this.Collection.where('UserDocumentID','==',auth.currentUser.uid).get();
            let promises = []
            console.log("AI:--",snapshot);
            
            snapshot.forEach(doc => {
                console.log("doc:",doc.data());
                
                promises.push(new Promise((resolve) => {
                    Promise.all([
                        this.Collection.doc(doc.id).collection('Marketplace').get(),
                        this.Collection.doc(doc.id).collection('Userdefined').get(),
                    ]).then(([Marketplace,UserDefined])=>{
                        let tempMarketPlace, tempUserdefined
                        Marketplace.forEach(doc =>{
                            if(!tempMarketPlace){
                                tempMarketPlace = doc.data()
                            }
                        })
                        UserDefined.forEach(doc =>{
                            if(!tempUserdefined){
                                tempUserdefined = doc.data()
                            }
                        })
                        resolve({ 
                            ...doc.data(),
                            Marketplace: tempMarketPlace,
                            UserDefined: tempUserdefined, 
                            id: doc.id
                        })
                    })
                }));
            });
            let list = await Promise.all(promises);
            return list
        }
        catch(err) {
            console.log(err);
        }
    }
    static async AddModelToStation(userdata,modeldata,modelid) {
        try{
            let response = await this.Collection.add({
                UserDocumentID: userdata.uid,
                UserEmail: userdata.email
            })
            let Marketplace = await this.Collection.doc(response.id).collection('Marketplace')
            let UserDefined = await this.Collection.doc(response.id).collection('Userdefined')
            let res = await Marketplace.add({
                ...modeldata,
                MarketplaceBlockID: modelid,
                Isdeleted: false,
                // StationID: response.id // not required
            })
        }
        catch(err) {
            console.log(err);
        }
    }

    
}

export default Station;