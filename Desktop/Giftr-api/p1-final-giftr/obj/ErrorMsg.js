class ErrorMsg {
    constructor(status, code, title, detail, pointer){
        let msg = {
            status,
            code,
            title,
            detail,
            source:{
                pointer
            }
        }
        this.errors = [];
        this.errors.push(msg)
    }
}

module.exports = ErrorMsg;
