import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Certificate from '../components/Certificate';

const API_URL = 'http://localhost:5000/api';

const MyApplication = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Task submission state
  const [submittingTask, setSubmittingTask] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({ gitRepo: '', liveLink: '', documentUrl: '' });

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/internship/my-application`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplication(res.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load application');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionChange = (e) => {
    setSubmissionForm({ ...submissionForm, [e.target.name]: e.target.value });
  };

  const submitTask = async (taskId, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/internship/submit-task`, { taskId, ...submissionForm }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmittingTask(null);
      setSubmissionForm({ gitRepo: '', liveLink: '', documentUrl: '' });
      fetchApplication();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting task');
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-[var(--text-primary)]">Loading application...</div>;

  if (!application) {
    return (
      <div className="min-h-screen py-12 px-4 text-center">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">You haven't applied yet!</h2>
        <Link to="/apply-internship" className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-md hover:bg-indigo-600 transition-colors">
          Apply Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8">My Internship Application</h1>

      <div className="bg-[var(--bg-secondary)] shadow-xl rounded-2xl overflow-hidden border border-[var(--border-color)] mb-8">
        <div className="px-6 py-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]">
          <h3 className="text-xl leading-6 font-medium text-[var(--text-primary)]">Application Status</h3>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
            application.status === 'Approved' ? 'bg-green-100 text-green-800' :
            application.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
            application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {application.status}
          </span>
        </div>
        <div className="p-6 text-[var(--text-secondary)]">
          <p>Thank you for applying! Your application is currently <strong className="text-[var(--text-primary)]">{application.status}</strong>.</p>
        </div>
      </div>

      {application.status !== 'Pending' && application.status !== 'Rejected' && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Assigned Tasks</h2>
          {application.assignedTasks.length === 0 ? (
            <p className="text-[var(--text-secondary)]">No tasks assigned yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {application.assignedTasks.map((t) => (
                <div key={t._id} className="bg-[var(--bg-secondary)] rounded-xl shadow-lg border border-[var(--border-color)] overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-[var(--text-primary)]">{t.task?.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-md font-semibold ${
                        t.status === 'Verified' ? 'bg-green-100 text-green-800' :
                        t.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">{t.task?.details}</p>
                    {t.task?.referalLink && (
                      <a href={t.task.referalLink} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] text-sm hover:underline block mb-4">
                        Reference Link
                      </a>
                    )}

                    {t.status === 'Pending' && submittingTask !== t.task?._id && (
                      <button 
                        onClick={() => setSubmittingTask(t.task?._id)}
                        className="w-full mt-2 bg-[var(--accent)] text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
                      >
                        Submit Task
                      </button>
                    )}

                    {submittingTask === t.task?._id && (
                      <form onSubmit={(e) => submitTask(t.task?._id, e)} className="mt-4 space-y-3 animate-fade-in">
                        <input required name="gitRepo" placeholder="GitHub Repo Link" value={submissionForm.gitRepo} onChange={handleSubmissionChange} className="w-full px-3 py-2 text-sm border rounded bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-color)]" />
                        <input required name="liveLink" placeholder="Live Demo Link" value={submissionForm.liveLink} onChange={handleSubmissionChange} className="w-full px-3 py-2 text-sm border rounded bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-color)]" />
                        <input required name="documentUrl" placeholder="Document/Report Link" value={submissionForm.documentUrl} onChange={handleSubmissionChange} className="w-full px-3 py-2 text-sm border rounded bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-color)]" />
                        <div className="flex space-x-2">
                          <button type="submit" className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">Submit</button>
                          <button type="button" onClick={() => setSubmittingTask(null)} className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {application.certificateIssued && (
        <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-center animate-fade-in-up delay-200">
          <h2 className="text-3xl font-bold text-white mb-4">Congratulations! ðŸŽ‰</h2>
          <p className="text-indigo-100 mb-8">You have successfully completed all tasks and your internship is verified.</p>
          <Certificate userName={application.resume.name} issueDate={new Date().toLocaleDateString()} />
        </div>
      )}
    </div>
  );
};

export default MyApplication;
