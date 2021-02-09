const request = require("supertest");
const req = require("express/lib/request");
const FakeTeenyUrl = require("./fake_data");
const sinon = require("sinon");
const TeenyURL = require("../../models/teenyURL");
let server;

describe("Route /api/v1/ for the teeny url api", () => {
    beforeAll(async (done) => {
        //server = require("../../app");
        await FakeTeenyUrl.deleteAll();
        done();
    });

    beforeEach(async (done) => {
        server = require("../../app");
        await FakeTeenyUrl.createMany(160); // creates 160 teenyUrls
        done();
    });

    afterEach(async (done) => {
        server.close();
        await FakeTeenyUrl.deleteAll();
        // Restore all the mocks back to their original value
        // Only works when the mock was created with `jest.spyOn`
        jest.restoreAllMocks();
        done();
    });

    afterAll(async (done) => {
        await FakeTeenyUrl.deleteAll();
        //server.close();
        FakeTeenyUrl.end();
        done();
    });

    describe("GET /teenyurls", () => {
        describe("200 SUCCESS", () => {
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

            it("Should return an empty array if there are no teenyURLs", async (done) => {
                await FakeTeenyUrl.deleteAll();
                const res = await request(server).get("/api/v1/teenyurls");
                expect(res.body.teenyURLs.length).toBe(0);
                done();
            });
        });

        describe("500 INTERNAL SERVER ERROR", () => {
            it("Should return a status code of 500", async (done) => {
                const stub = sinon
                    .stub(TeenyURL, "fetchAll")
                    .throws(Error("db query failed"));
                const res = await request(server).get("/api/v1/teenyurls");
                expect(res.status).toBe(500);
                stub.restore();
                done();
            });

            it("Should return a JSON body", async (done) => {
                const stub = sinon
                    .stub(TeenyURL, "fetchAll")
                    .throws(Error("db query failed"));
                const res = await request(server).get("/api/v1/teenyurls");
                expect(res.get("Content-Type")).toMatch(/json/);
                stub.restore();
                done();
            });

            it("Should return correct error response", async (done) => {
                const expectedErrorResponse = {
                    message: "Internal Error",
                    status: 500,
                    errors: [],
                };
                const stub = sinon
                    .stub(TeenyURL, "fetchAll")
                    .throws(Error("db query failed"));
                const res = await request(server).get("/api/v1/teenyurls");
                expect(res.body).toEqual(
                    expect.objectContaining(expectedErrorResponse)
                );
                stub.restore();
                done();
            });
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

        it("Should return an empty array if there are no teenyURLs", async (done) => {
            await FakeTeenyUrl.deleteAll();
            const res = await request(server).get("/api/v1/teenyurls");
            expect(res.body.teenyURLs.length).toBe(0);
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

        it("Should return an empty array if there are no teenyURLs", async (done) => {
            await FakeTeenyUrl.deleteAll();
            const res = await request(server).get("/api/v1/teenyurls");
            expect(res.body.teenyURLs.length).toBe(0);
            done();
        });
    });

    describe("GET /teenyurls/:alias", () => {
        describe("200 SUCCESS", () => {
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

        describe("404 NOT FOUND", () => {
            it("Should return a 404 status code if teenyURL not found", async (done) => {
                await FakeTeenyUrl.deleteAll();
                const res = await request(server).get("/api/v1/teenyurls/fb");
                expect(res.status).toBe(404);
                done();
            });

            it("Should return an error in JSON body ", async (done) => {
                await FakeTeenyUrl.deleteAll();
                const res = await request(server).get("/api/v1/teenyurls/fb");
                expect(res.get("Content-Type")).toMatch(/json/);
                done();
            });

            it("Should return an error with correct scheme, if teenyURL not found", async (done) => {
                // The returned error body should match this error.
                const error = {
                    message: "Not Found",
                    status: 404,
                    errors: [],
                };
                await FakeTeenyUrl.deleteAll();
                const res = await request(server).get("/api/v1/teenyurls/fb");
                expect(res.body).toEqual(expect.objectContaining(error));
                done();
            });
        });

        describe("400 BAD REQUEST", () => {
            it("Should return a 404 status code if the param value exeeds 20 characters.", async (done) => {
                const alias = "a".repeat(25); // param exceeds 20 character limit
                await FakeTeenyUrl.deleteAll();
                const res = await request(server).get(
                    `/api/v1/teenyurls/${alias}`
                );
                expect(res.status).toBe(400);
                done();
            });

            it("Should return correct error message body", async (done) => {
                const alias = "a".repeat(25); // param exceeds 20 character limit

                const error = {
                    message: "Bad Request",
                    status: 400,
                    errors: [
                        {
                            value: alias,
                            msg: "Alias exceeds 20 character limit.",
                            param: "alias",
                            location: "params",
                        },
                    ],
                };
                await FakeTeenyUrl.deleteAll();
                const res = await request(server).get(
                    `/api/v1/teenyurls/${alias}`
                );

                expect(res.body).toEqual(expect.objectContaining(error));
                done();
            });
        });
    });

    describe("POST /shorten", () => {
        const jsonBody = {
            alias: "duck",
            long_url: "https://duckduckgo.com",
        };

        describe("201 CREATED", () => {
            it("Should return a status code of 201", async (done) => {
                const res = await request(server)
                    .post("/api/v1/shorten")
                    .send(jsonBody)
                    .set("Accept", "application/json");
                expect(res.status).toBe(201);
                done();
            });

            it("Should return a JSON body", async (done) => {
                const res = await request(server)
                    .post("/api/v1/shorten")
                    .send(jsonBody)
                    .set("Accept", "application/json");

                expect(res.get("Content-Type")).toMatch(/json/);
                done();
            });

            it("Should create a teenyURL and return it", async (done) => {
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
                done();
            });
        });
        describe("429 TOO MANY REQUESTS", () => {
            it("Should return a status code of 429", async (done) => {
                // Mock the `ip` property on the `req` object
                jest.spyOn(req, "ip", "get").mockReturnValue("1.2.3.4");
                // Testing the rate limiter, which has been limited to 10 requests.
                let jsonBodies = [];
                for (let i = 1; i <= 11; i++) {
                    jsonBodies.push({
                        alias: i,
                        long_url: `http://www.${i}.com`,
                    });
                }

                let responses = [];
                for (let i = 0; i < 11; i++) {
                    const res = await request(server)
                        .post("/api/v1/shorten")
                        .send(jsonBodies[i])
                        .set("Accept", "application/json");
                    responses.push(res);
                }

                const error = {
                    message: "Too many requests",
                    status: 429,
                    errors: [
                        {
                            msg: "Too many requests, Please try again later."
                        },
                    ],
                };

                expect(responses[10].status).toBe(429);
                expect(responses[10].get("Content-Type")).toMatch(/json/);
                expect(responses[10].body).toEqual(expect.objectContaining(error));
                done();
            });

        });

        describe("400 BAD REQUEST", () => {
            it("Should return a status code of 400", async (done) => {
                // Create a teenyUrl for testing
                const teenyUrl = new FakeTeenyUrl();
                teenyUrl.alias = "duck";
                teenyUrl.long_url = "https://duckduckgo.com";

                await teenyUrl.save();

                const error = {
                    message: "Bad Request",
                    status: 400,
                    errors: [
                        {
                            value: "duck",
                            msg: "Alias already in use",
                            param: "alias",
                            location: "body",
                        },
                    ],
                };

                const res = await request(server)
                    .post("/api/v1/shorten")
                    .send(jsonBody)
                    .set("Accept", "application/json");
                expect(res.status).toBe(400);
                expect(res.get("Content-Type")).toMatch(/json/);
                expect(res.body).toEqual(expect.objectContaining(error));
                done();
            });

        });
    });
});
