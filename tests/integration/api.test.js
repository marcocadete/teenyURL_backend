const request = require("supertest");
const FakeTeenyUrl = require("./fake_data");

let server;

describe("Route /api/v1/ for the teeny url api", () => {
    beforeAll((done) => {
        server = require("../../app");
        done();
    });

    beforeEach(async (done) => {
        await FakeTeenyUrl.createMany(160); // creates 160 teenyUrls
        done();
    });

    afterEach(async (done) => {
        await FakeTeenyUrl.deleteAll();
        done();
    });

    afterAll((done) => {
        server.close();
        FakeTeenyUrl.end();
        done();
    });

    describe("GET /teenyurls", () => {
        it("Should return a status Code of 200", async (done) => {
            const res = await request(server).get("/api/v1/teenyurls");
            expect(res.status).toBe(200);
            done();
        });

        it("Should return a JSON body", async (done) => {
            const res = await request(server).get("/api/v1/teenyurls");
            expect(res.get("Content-Type")).toMatch(/json/);
            done();
        });

        it("Should return the first 50 teeny urls", async (done) => {
            const res = await request(server).get("/api/v1/teenyurls");
            expect(res.body.teenyURLs.length).toBe(50);
            done();
        });
    });

    describe("GET /teenyurls?page=1", () => {
        it("Should return a status Code of 200", async (done) => {
            const res = await request(server).get("/api/v1/teenyurls?page=1");
            expect(res.status).toBe(200);
            done();
        });

        it("Should return a JSON body", async (done) => {
            const res = await request(server).get("/api/v1/teenyurls?page=1");
            expect(res.get("Content-Type")).toMatch(/json/);
            done();
        });

        it("Should return the next 50 teeny urls, using pagination. (DEFAULT LIMIT=50)", async (done) => {
            const firstPageResponse = await request(server).get(
                "/api/v1/teenyurls"
            );
            const secondPageResponse = await request(server).get(
                "/api/v1/teenyurls?page=1"
            );
            expect(secondPageResponse.body.teenyURLs.length).toBe(50);
            expect(secondPageResponse.body.teenyURLs).not.toEqual(
                firstPageResponse.body.teenyURLs
            );
            done();
        });

        it("Should return an array with atleast one teeny url in it", async (done) => {
            const res = await request(server).get("/api/v1/teenyurls?page=1");
            expect(res.body.teenyURLs[0]).toHaveProperty("alias");
            expect(res.body.teenyURLs[0]).toHaveProperty("long_url");
            expect(res.body.teenyURLs[0]).toHaveProperty("created_at");
            done();
        });
    });

    describe("GET /teenyurls?limit=5", () => {
        it("Should return a status Code of 200", async (done) => {
            const res = await request(server).get("/api/v1/teenyurls?limit=5");
            expect(res.status).toBe(200);
            done();
        });

        it("Should return a JSON body", async (done) => {
            const res = await request(server).get("/api/v1/teenyurls?limit=5");
            expect(res.get("Content-Type")).toMatch(/json/);
            done();
        });

        it("Should only return a max of 5 teeny urls", async (done) => {
            const res = await request(server).get("/api/v1/teenyurls?limit=5");
            expect(res.body.teenyURLs.length).toBe(5);
            done();
        });

        it("Should return an array with atleast one teeny url in it", async (done) => {
            const res = await request(server).get("/api/v1/teenyurls?limit=5");
            expect(res.body.teenyURLs[0]).toHaveProperty("alias");
            expect(res.body.teenyURLs[0]).toHaveProperty("long_url");
            expect(res.body.teenyURLs[0]).toHaveProperty("created_at");
            done();
        });
    });

    describe("GET /teenyurls/:alias", () => {
        it("Should return a status Code of 200", async (done) => {
            // Create a teenyUrl for testing
            const teenyUrl = new FakeTeenyUrl();
            teenyUrl.alias = "fb";
            teenyUrl.long_url = "https://facebook.com";

            await teenyUrl.save();

            const res = await request(server).get("/api/v1/teenyurls/fb");
            expect(res.status).toBe(200);
            done();
        });

        it("Should return a JSON body", async (done) => {
            // Create a teenyUrl for testing
            const teenyUrl = new FakeTeenyUrl();
            teenyUrl.alias = "fb";
            teenyUrl.long_url = "https://facebook.com";

            await teenyUrl.save();

            const res = await request(server).get("/api/v1/teenyurls/fb");
            expect(res.get("Content-Type")).toMatch(/json/);
            done();
        });

        it("Should find a teeny url by alias and return it", async (done) => {
            // Create a teenyUrl for testing
            const teenyUrl = new FakeTeenyUrl();
            teenyUrl.alias = "fb";
            teenyUrl.long_url = "https://facebook.com";

            await teenyUrl.save();

            const res = await request(server).get("/api/v1/teenyurls/fb");
            expect(res.body).toHaveProperty("alias");
            expect(res.body).toHaveProperty("long_url");
            expect(res.body).toHaveProperty("created_at");
            expect(res.body).toEqual(expect.objectContaining(teenyUrl));
            expect(res.body.alias).toEqual("fb");
            expect(res.body.long_url).toEqual("https://facebook.com");
            done();
        });
    });

    describe("POST /shorten", () => {
        const jsonBody = {
            alias: "duck",
            long_url: "https://duckduckgo.com",
        };

        it("Should return a status code of 201", async () => {
            const res = await request(server)
                .post("/api/v1/shorten")
                .send(jsonBody)
                .set("Accept", "application/json");
            expect(res.status).toBe(201);
        });

        it("Should return a JSON body", async () => {
            const res = await request(server)
                .post("/api/v1/shorten")
                .send(jsonBody)
                .set("Accept", "application/json");

            expect(res.get("Content-Type")).toMatch(/json/);
        });

        it("Should create a teenyURL and return it", async () => {
            const res = await request(server)
                .post("/api/v1/shorten")
                .send(jsonBody)
                .set("Accept", "application/json");

            expect(res.body).toHaveProperty("alias");
            expect(res.body).toHaveProperty("long_url");
            expect(res.body).toHaveProperty("created_at");
            expect(res.body).toEqual(expect.objectContaining(jsonBody));
            expect(res.body.alias).toEqual("duck");
            expect(res.body.long_url).toEqual("https://duckduckgo.com");
        });
    });
});
