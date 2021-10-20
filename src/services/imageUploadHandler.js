export default function imageUploadHandler(e, maxSize, errorParam, errorMsg) {
    return new Promise((resolve, reject) => {    
        if (e.target.files[0].size > maxSize) {
            reject([{param: errorParam, msg: errorMsg}])
        }
    
        const reader = new FileReader();
        reader.onloadend = () => {
            const songJacketString = reader.result.replace("data:", "").replace(/^.+,/, "");
            resolve(songJacketString);
        }
        reader.readAsDataURL(e.target.files[0]);
    });
}