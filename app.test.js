const request = require('supertest');
const app = require('./app'); 
const admin = require('firebase-admin');

let server;

describe('API Endpoints', () => {
  beforeAll(() => {
    server = app.listen(3000); // start server
  });

  // test API updateData/:type/:category/:brand
  it('should update the quantity of an item', async () => {
    const name = 'Test';
    const quantity = 1;

    const res = await request(app)
    .post(`/updateData/${name}`)
    .query({ quantity });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
      quantity: expect.any(Number)
    }));
  });

  // test API /getAllData
  it('should retrieve all data from Firebase database', async () => {
    const res = await request(app).get('/getAllData');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  // test API /downloadData
  it('should download data as an Excel file', async () => {
    const res = await request(app).get('/downloadData');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toEqual('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');// check whether the return is an Excel file
  });


  afterAll((done) => {
    server.close(() => {
      console.log("Server closed!");
      admin.app().delete().then(() => {
        done();
      }); //close server
    });
  });
});
