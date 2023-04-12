import { fireStore, auth } from '../firebase';

class Market {

    static mapModelToCollection = {
        cad: 'MarketPlace-CAD',
        algorithm: 'MarketPlace-Algorithms',
        sensor: 'MarketPlace_Sensor',
        actuator:'MarketPlace_Actuator '
    }
    static async ProductList(model) {
        
        let Collection  = fireStore.collection(this.mapModelToCollection[model]);
        try {
            
            const snapshot = await Collection.get();
            let promises = []
            // console.log("got here:");
            
            snapshot.forEach(doc => {
                // console.log("doc:",doc.data());
                
                promises.push(new Promise((resolve) => {
                    resolve({ ...doc.data(), id: doc.id})
                }));
            });
            return await Promise.all(promises);
        }
        catch(err) {
            console.log("market-api:-",err);
        }
    }

    static async getMarketPlaceById(id) {
        const collection  = await fireStore.collection('MARKETPLACE').doc(id).get();

        return collection.data();
 
    }

    // static async latestTasks() {
    //     try {
    //         const email = auth.currentUser.email;
    //         const snapshot = await fireStore.collection('TaskAssign')
    //             .where('EmailId', '==', email)
    //             .orderBy('CreatedAt')
    //             .limit(5)
    //             .get()
    //         const result = [];
    //         const promises = [];
    //         snapshot.forEach(doc => {
    //             promises.push(new Promise((resolve) => {
    //                 fireStore.collection('Task')
    //                     .doc(doc.data().task.id).get()
    //                     .then(task => {
    //                         console.log('task is : ', task.data());
    //                         resolve(task.data());
    //                     })
    //             }));
    //         });
    //         return await Promise.all(promises);
    //     }
    //     catch(err) {
    //         console.log(err);
    //     }
    // }
    static async getMarketPlaceByType(type=null) {
        console.log("type>>",type)
      const models=await fireStore.collection('MARKETPLACE').get();
      const result=[]

      models.forEach(model=>{
        const data=model.data()
        if(data.type===type){
            result.push({
                ...data,
                modelId:model.id
            })
        }
      })
      return result;
    }
}

export default Market;
