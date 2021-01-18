const request = require("supertest");
const FakeTeenyUrl = require("./fake_data");

let server;

describe("Route /api/v1/ for the teeny url api", () => {
    beforeEach(async () => {
        server = require("../../app");
        await FakeTeenyUrl.createMany(160); // creates 160 teenyUrls
    });

    afterEach(async () => {
        await FakeTeenyUrl.deleteAll();
        server.close();
    });

    describe("GET /teenyurls", () => {
        it("Should return a status Code of 200", async () => {
            const res = await request(server).get("/api/v1/teenyurls");
            expect(res.status).toBe(200);
        });

        it("Should return a JSON body", async () => {
            const res = await request(server).get("/api/v1/teenyurls");
            expect(res.get("Content-Type")).toMatch(/json/);
        });

        it("Should return the first 50 teeny urls", async () => {
            const res = await request(server).get("/api/v1/teenyurls");
            expect(res.body.teenyURLs.length).toBe(50);
        });
    });

    describe("GET /teenyurls?page=1", () => {
        it("Should return a status Code of 200", async () => {
            const res = await request(server).get("/api/v1/teenyurls?page=1");
            expect(res.status).toBe(200);
        });

        it("Should return a JSON body", async () => {
            const res = await request(server).get("/api/v1/teenyurls?page=1");
            expect(res.get("Content-Type")).toMatch(/json/);
        });

        it("Should return the next 50 teeny urls, using pagination. (DEFAULT LIMIT=50)", async () => {
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
        });

        it("Should return an array with atleast one teeny url in it", async () => {
            const res = await request(server).get("/api/v1/teenyurls?page=1");
            expect(res.body.teenyURLs[0]).toHaveProperty("alias");
            expect(res.body.teenyURLs[0]).toHaveProperty("long_url");
            expect(res.body.teenyURLs[0]).toHaveProperty("created_at");
        });
    });

    describe("GET /teenyurls?limit=5", () => {
        it("Should return a status Code of 200", async () => {
            const res = await request(server).get("/api/v1/teenyurls?limit=5");
            expect(res.status).toBe(200);
        });

        it("Should return a JSON body", async () => {
            const res = await request(server).get("/api/v1/teenyurls?limit=5");
            expect(res.get("Content-Type")).toMatch(/json/);
        });

        it("Should only return a max of 5 teeny urls", async () => {
            const res = await request(server).get("/api/v1/teenyurls?limit=5");
            expect(res.body.teenyURLs.length).toBe(5);
        });

        it("Should return an array with atleast one teeny url in it", async () => {
            const res = await request(server).get("/api/v1/teenyurls?limit=5");
            expect(res.body.teenyURLs[0]).toHaveProperty("alias");
            expect(res.body.teenyURLs[0]).toHaveProperty("long_url");
            expect(res.body.teenyURLs[0]).toHaveProperty("created_at");
        });
    });
});
