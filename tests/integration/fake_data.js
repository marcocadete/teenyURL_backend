const db = require("../../database/db");
const faker = require("faker");

module.exports = class FakeTeenyUrl {
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

    static createMany(number = 5) {
        // E.g Format: values = [[alias, long_url], [alias, long_url]]
        let values = [];
        for (let i = 0; i < number; i++) {
            const alias = faker.name.firstName() + faker.random.number();
            const long_url = faker.internet.url();
            values.push([alias, long_url]);
        }
        return db.query("INSERT INTO teeny_url (alias, long_url) VALUES ?", [
            values,
        ]);
    }

    static deleteAll() {
        return db.query("DELETE FROM teeny_url");
    }

    static fetchAll(limit = "3", offset = "0") {
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
