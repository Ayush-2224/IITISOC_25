import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    dateTime: '',
    notes: '',
    invitedEmails: [''],
    sendReminder: false,
    reminderTime: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Event title is required');
      return false;
    }
    if (!formData.dateTime) {
      setError('Date and time is required');
      return false;
    }
    if (formData.sendReminder && !formData.reminderTime) {
      setError('Reminder time is required when reminder is enabled');
      return false;
    }
    const invalidEmails = formData.invitedEmails
      .filter(email => email.trim() !== '')
      .filter(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    
    if (invalidEmails.length > 0) {
      setError('Please enter valid email addresses');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.invitedEmails];
    newEmails[index] = value;
    setFormData(prev => ({
      ...prev,
      invitedEmails: newEmails
    }));
  };

  const addEmailField = () => {
    setFormData(prev => ({
      ...prev,
      invitedEmails: [...prev.invitedEmails, '']
    }));
  };

  const removeEmailField = (index) => {
    setFormData(prev => ({
      ...prev,
      invitedEmails: prev.invitedEmails.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Filter out empty emails
      const filteredEmails = formData.invitedEmails.filter(email => email.trim() !== '');
      
      // Prepare the data according to the backend model
      const eventData = {
        title: formData.title.trim(),
        dateTime: new Date(formData.dateTime).toISOString(),
        notes: formData.notes.trim(),
        invitedEmails: filteredEmails,
        reminder: {
          sendReminder: formData.sendReminder,
          reminderTime: formData.sendReminder ? new Date(formData.reminderTime).toISOString() : null
        }
      };

      const response = await axios.post('/api/events', eventData);
      navigate('/events'); // Redirect to events list after successful creation
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Create New Event
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              required
              value={formData.dateTime}
              onChange={handleChange}
              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite People
            </label>
            {formData.invitedEmails.map((email, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="email@example.com"
                  className="p-2 flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeEmailField(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addEmailField}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              + Add another email
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendReminder"
              name="sendReminder"
              checked={formData.sendReminder}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="sendReminder" className="ml-2 block text-sm text-gray-900">
              Send reminder
            </label>
          </div>

          {formData.sendReminder && (
            <div>
              <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700">
                Reminder Time
              </label>
              <input
                type="datetime-local"
                id="reminderTime"
                name="reminderTime"
                value={formData.reminderTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistration; 