import {has,get,isEmpty,filter} from 'lodash';
// import Localbase from 'localbase'
// let dvrIndexdb = new Localbase('dvr_db')




  // export async function updatedPlot(data)
  // {
  //   console.log("update the plot")
  //   dvrIndexdb.collection('users').add({
  //     id: 1,
  //     name: 'Bill',
  //     age: 47
  //   })

   

  //   console.log("data",data)


    
  // }

  export async function checkCZMLSanity(data){
    
  }


  export async function saveData(data)
  {

    return "hello"
    console.log("update the plot",data,has(data,'data'),get(data,['simulatioinfo']))
    let key
    if(has(data,['simulatioinfo'])){

      const project_id = get(data,['simulatioinfo','Project id'])
      const simulation_id = get(data,['simulatioinfo','Simulation id'])
      const parameter_id = get(data,['simulatioinfo','Parameter id'])
      const runid = get(data,['simulatioinfo','Runid'])
      key= `${project_id}/${simulation_id}/${parameter_id}/${runid.toString()}`
    }

    console.log("saveData===?",key)

    if(key){

      const filename =  get(data,['fileinfo','filename'])
      const min_time =  get(data,['fileinfo','min_time'])
      const max_time =  get(data,['fileinfo','max_time'])

      const project_id = get(data,['simulatioinfo','Project id'])
      const simulation_id = get(data,['simulatioinfo','Simulation id'])
      const parameter_id = get(data,['simulatioinfo','Parameter id'])
      const runid = get(data,['simulatioinfo','Runid'])

      await dvrIndexdb
      .collection('plotgraph')
      .add({
        filename :filename,
        min_time:min_time,
        max_time:max_time,
        project_id:project_id,
        simulation_id:simulation_id,
        parameter_id:parameter_id,
        runid:runid

      },filename)

      let tree = await dvrIndexdb.collection('plotgraph-structure').doc(key).get()

      console.log("tree_infotree_info",tree,isEmpty(tree))

      if(isEmpty(tree)){
        await dvrIndexdb
      .collection('plotgraph-structure')      
      .doc(key)
      .set(
        get(data,['data','tree_info'])
      )
      }

    }


    let tree_order = await dvrIndexdb.collection('plotgraph').orderBy('min_time').get({ keys: true })

    
 


    
  }