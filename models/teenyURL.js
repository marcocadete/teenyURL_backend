const db = require("../database/db");

module.exports = class TeenyURL {
    constructor(alias, long_url) {
        this.alias = alias;
        this.long_url = long_url;
    }

    save() {
        return db.execute(
            "INSERT INTO teeny_url (alias, long_url) VALUES (?, ?)",
            [this.alias, this.long_url]
        );
    }

    static createMany(values) {
        // E.g Format: values = [[alias, long_url], [alias, long_url]]
        return db.execute("INSERT INTO teeny_url (alias, long_url) VALUES ?", [
            values,
        ]);
    }

    static fetchAll(limit = "50", offset = "0") {
        return db.execute("SELECT * FROM teeny_url LIMIT ? OFFSET ?", [
            limit,
            offset,
        ]);
    }

    static findByAlias(alias) {
        return db.execute("SELECT * FROM teeny_url WHERE alias = ?", [alias]);
    }

    static deleteByAlias(alias) {
        return db.execute("DELETE FROM teeny_url WHERE alias = ?", [alias]);
    }
};
