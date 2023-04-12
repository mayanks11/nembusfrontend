import firebase from '../firebase'; 



export const updateVersionStatusfunction = async(data)=>{
    const onVersionStatusUpdate = firebase
    .app()
    .functions('us-central1')
    .httpsCallable('onVersionStatusUpdate');

    const {componentid,
        versionid,
        remark,
        versionstatus,
        lastmodifiedby} = data

    await onVersionStatusUpdate({
        componentid:componentid,
            versionid:versionid,
            remark:remark,
            versionstatus:versionstatus,
            lastmodifiedby:lastmodifiedby
      });

}


export const updateStatusAtComponent = async(data)=>{
    const updateStatusAtComponentCol = firebase
    .app()
    .functions('us-central1')
    .httpsCallable('updateStatusAtComponent');

    const {componentid} = data

    await updateStatusAtComponentCol({
        componentid:componentid
      });

}