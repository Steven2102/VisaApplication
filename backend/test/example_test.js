const chai = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Application = require('../models/Application');
const Invoice = require('../models/Invoice');
const { addapplication, updateapplication, getApplications, deleteapplication } = require('../controllers/applicationController');
const { addinvoice, updateinvoice, deleteinvoice, getinvoices, getInvoiceByApplication } = require('../controllers/invoiceController');

const { expect } = chai;

// Ensure clean stubs between tests
afterEach(() => {
  sinon.restore();
});

describe('addapplication', () => {
  it('creates a new application (201)', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: 'Holiday Visa', cost: '100' }
    };
    const created = { _id: new mongoose.Types.ObjectId(), userId: req.user.id, ...req.body };
    const createStub = sinon.stub(Application, 'create').resolves(created);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await addapplication(req, res);
  expect(createStub.calledOnce).to.be.true;
  // Ensure required fields were part of the create call
  const passedArg = createStub.firstCall.args[0];
  expect(passedArg.userId.toString()).to.equal(req.user.id.toString());
  expect(passedArg.title).to.equal(req.body.title);
  expect(passedArg.cost).to.equal(req.body.cost);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(created)).to.be.true;
  });

  it('handles errors (500)', async () => {
    sinon.stub(Application, 'create').throws(new Error('DB Error'));
    const req = { user: { id: new mongoose.Types.ObjectId() }, body: { title: 'X' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await addapplication(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});

describe('updateapplication', () => {
  it('updates existing application', async () => {
    const id = new mongoose.Types.ObjectId();
    const doc = { _id: id, title: 'Old', cost: '100', save: sinon.stub().resolvesThis() };
    sinon.stub(Application, 'findById').resolves(doc);
    const req = { params: { id }, body: { title: 'New Title', cost: '150' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateapplication(req, res);
    expect(doc.title).to.equal('New Title');
    expect(doc.cost).to.equal('150');
    expect(res.status.called).to.be.false;
    expect(res.json.calledOnce).to.be.true;
  });

  it('returns 404 for missing application', async () => {
    sinon.stub(Application, 'findById').resolves(null);
    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateapplication(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('handles error (500)', async () => {
    sinon.stub(Application, 'findById').throws(new Error('DB Error'));
    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateapplication(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });
});

describe('getApplications', () => {
  it('returns list for user', async () => {
    const userId = new mongoose.Types.ObjectId();
    const apps = [{ _id: new mongoose.Types.ObjectId(), userId, title: 'A' }];
    sinon.stub(Application, 'find').resolves(apps);
    const req = { user: { id: userId } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getApplications(req, res);
    expect(res.json.calledWith(apps)).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it('handles error (500)', async () => {
    sinon.stub(Application, 'find').throws(new Error('DB Error'));
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getApplications(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });
});

describe('deleteapplication', () => {
  it('deletes existing', async () => {
    const doc = { remove: sinon.stub().resolves() };
    sinon.stub(Application, 'findById').resolves(doc);
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteapplication(req, res);
    expect(doc.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'application deleted' })).to.be.true;
  });

  it('returns 404 when missing', async () => {
    sinon.stub(Application, 'findById').resolves(null);
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteapplication(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('handles error (500)', async () => {
    sinon.stub(Application, 'findById').throws(new Error('DB Error'));
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteapplication(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });
});

// ================= INVOICE TESTS =================

describe('addinvoice', () => {
  it('creates invoice (201)', async () => {
    const req = { user: { id: new mongoose.Types.ObjectId() }, body: { applicationId: new mongoose.Types.ObjectId(), title: 'Holiday Visa', cost: '100', method: 'paypal', details: { info: 'abc' } } };
    const created = { _id: new mongoose.Types.ObjectId(), userId: req.user.id, ...req.body };
    const createStub = sinon.stub(Invoice, 'create').resolves(created);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await addinvoice(req, res);
    expect(createStub.calledOnce).to.be.true;
    const arg = createStub.firstCall.args[0];
    expect(arg.userId.toString()).to.equal(req.user.id.toString());
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(created)).to.be.true;
  });

  it('handles error (500)', async () => {
    sinon.stub(Invoice, 'create').throws(new Error('DB Error'));
    const req = { user: { id: new mongoose.Types.ObjectId() }, body: { applicationId: new mongoose.Types.ObjectId(), title: 'X', cost: '1', method: 'paypal' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await addinvoice(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });
});

describe('updateinvoice', () => {
  it('updates existing invoice', async () => {
    const userId = new mongoose.Types.ObjectId();
    const doc = { _id: new mongoose.Types.ObjectId(), userId, title: 'Old', cost: '100', method: 'paypal', details: { info: 'x' }, save: sinon.stub().resolvesThis() };
    sinon.stub(Invoice, 'findById').resolves(doc);
    const req = { user: { id: userId.toString() }, params: { id: doc._id }, body: { title: 'New', cost: '150', method: 'credit_card', details: { info: 'y' } } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateinvoice(req, res);
    expect(doc.title).to.equal('New');
    expect(doc.method).to.equal('credit_card');
    expect(res.status.called).to.be.false;
    expect(res.json.calledOnce).to.be.true;
  });

  it('rejects unauthorized (403)', async () => {
    const doc = { _id: new mongoose.Types.ObjectId(), userId: new mongoose.Types.ObjectId(), save: sinon.stub().resolvesThis() };
    sinon.stub(Invoice, 'findById').resolves(doc);
    const req = { user: { id: new mongoose.Types.ObjectId().toString() }, params: { id: doc._id }, body: { title: 'New' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateinvoice(req, res);
    expect(res.status.calledWith(403)).to.be.true;
  });

  it('404 when missing', async () => {
    sinon.stub(Invoice, 'findById').resolves(null);
    const req = { user: { id: new mongoose.Types.ObjectId() }, params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateinvoice(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('handles error (500)', async () => {
    sinon.stub(Invoice, 'findById').throws(new Error('DB Error'));
    const req = { user: { id: new mongoose.Types.ObjectId() }, params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateinvoice(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });
});

describe('getinvoices', () => {
  it('returns invoices list', async () => {
    const userId = new mongoose.Types.ObjectId();
    const list = [{ _id: new mongoose.Types.ObjectId(), userId, title: 'A' }];
    sinon.stub(Invoice, 'find').resolves(list);
    const req = { user: { id: userId } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getinvoices(req, res);
    expect(res.json.calledWith(list)).to.be.true;
  });

  it('handles error (500)', async () => {
    sinon.stub(Invoice, 'find').throws(new Error('DB Error'));
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getinvoices(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });
});

describe('getInvoiceByApplication', () => {
  it('returns invoice by applicationId', async () => {
    const userId = new mongoose.Types.ObjectId();
    const applicationId = new mongoose.Types.ObjectId();
    const invoice = { _id: new mongoose.Types.ObjectId(), applicationId, userId };
    sinon.stub(Invoice, 'findOne').resolves(invoice);
    const req = { user: { id: userId }, params: { applicationId } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getInvoiceByApplication(req, res);
    expect(res.json.calledWith(invoice)).to.be.true;
  });

  it('404 when missing', async () => {
    sinon.stub(Invoice, 'findOne').resolves(null);
    const req = { user: { id: new mongoose.Types.ObjectId() }, params: { applicationId: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getInvoiceByApplication(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('handles error (500)', async () => {
    sinon.stub(Invoice, 'findOne').throws(new Error('DB Error'));
    const req = { user: { id: new mongoose.Types.ObjectId() }, params: { applicationId: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await getInvoiceByApplication(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });
});

describe('deleteinvoice', () => {
  it('deletes invoice', async () => {
    const userId = new mongoose.Types.ObjectId();
    const doc = { userId, remove: sinon.stub().resolves() };
    sinon.stub(Invoice, 'findById').resolves(doc);
    const req = { user: { id: userId.toString() }, params: { id: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteinvoice(req, res);
    expect(doc.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Invoice deleted' })).to.be.true;
  });

  it('403 when unauthorized delete', async () => {
    const doc = { userId: new mongoose.Types.ObjectId(), remove: sinon.stub().resolves() };
    sinon.stub(Invoice, 'findById').resolves(doc);
    const req = { user: { id: new mongoose.Types.ObjectId() }, params: { id: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteinvoice(req, res);
    expect(res.status.calledWith(403)).to.be.true;
  });

  it('404 when missing', async () => {
    sinon.stub(Invoice, 'findById').resolves(null);
    const req = { user: { id: new mongoose.Types.ObjectId() }, params: { id: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteinvoice(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });

  it('handles error (500)', async () => {
    sinon.stub(Invoice, 'findById').throws(new Error('DB Error'));
    const req = { user: { id: new mongoose.Types.ObjectId() }, params: { id: new mongoose.Types.ObjectId() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteinvoice(req, res);
    expect(res.status.calledWith(500)).to.be.true;
  });
});