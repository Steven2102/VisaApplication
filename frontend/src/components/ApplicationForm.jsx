import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ApplicationForm = ({ applications, setApplications, editingApplication, setEditingApplication }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', firstname: '', lastname: '', countryofresidence: '', email: '', city: '', dateofarrival: '', dateofdeparture: ''});

  useEffect(() => {
    if (editingApplication) {
      setFormData({
        title: editingApplication.title,
        firstname: editingApplication.firstname,
        lastname: editingApplication.lastname,
        countryofresidence: editingApplication.countryofresidence,
        email: editingApplication.email,
        city: editingApplication.city,
        dateofarrival: editingApplication.dateofarrival,
        dateofdeparture: editingApplication.dateofdeparture,
      });
    } else {
      setFormData({ title: '', firstname: '', lastname: '', countryofresidence: '', email: '', city: '', dateofarrival: '', dateofdeparture: ''});
    }
  }, [editingApplication]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingApplication) {
        const response = await axiosInstance.put(`/api/applications/${editingApplication._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(applications.map((application) => (application._id === response.data._id ? response.data : application)));
      } else {
        const response = await axiosInstance.post('/api/applications', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications([...applications, response.data]);
      }
      setEditingApplication(null);
      setFormData({ title: '', firstname: '', lastname: '', countryofresidence: '', email: '', city: '', dateofarrival: '', dateofdeparture: ''});
    } catch (error) {
      alert('Failed to save application.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingApplication ? 'Your Form Name: Edit Operation' : 'Create new Visa application'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Firstname"
        value={formData.firstname}
        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Lastname"
        value={formData.lastname}
        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Country of Residence"
        value={formData.countryofresidence}
        onChange={(e) => setFormData({ ...formData, countryofresidence: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="City"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.dateofarrival}
        onChange={(e) => setFormData({ ...formData, dateofarrival: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.dateofdeparture}
        onChange={(e) => setFormData({ ...formData, dateofdeparture: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingApplication ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
};

export default ApplicationForm;
