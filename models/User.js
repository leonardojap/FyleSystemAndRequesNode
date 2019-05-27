//modls with native js
function User(id, email, first_name, last_name, avatar) {
    this.id = id || "";
    this.first_name = first_name;
    this.email = email || "";
    this.last_name = last_name || "";
    this.avatar = avatar || "";
}

//to fill the data
User.prototype.fill = function(newFields) {
    for (var field in newFields) {
        if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
            if (this[field] !== 'undefined') {
                this[field] = newFields[field];
            }
        }
    }
};

module.exports = User;     // Export the User function as it is