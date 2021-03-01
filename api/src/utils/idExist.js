function idExist(array, id){
    array.find(e => {
        if(e.id == id){
            return true;
        }
    });
    return false;
}

module.exports = idExist;