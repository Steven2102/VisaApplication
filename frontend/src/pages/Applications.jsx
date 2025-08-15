import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationList from '../components/ApplicationList';
import { useAuth } from '../context/AuthContext';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get('/api/applications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(response.data);
      } catch (error) {
        alert('Failed to fetch applications.');
      }
    };
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get('/api/invoices', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setInvoices(response.data);
      } catch (error) {
        // silently ignore for now
      }
    };

    fetchApplications();
    fetchInvoices();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <ApplicationForm
        applications={applications}
        setApplications={setApplications}
        editingApplication={editingApplication}
        setEditingApplication={setEditingApplication}
      />
  <ApplicationList applications={applications} setApplications={setApplications} setEditingApplication={setEditingApplication} invoices={invoices} />
    </div>
  );
};

export default Applications;