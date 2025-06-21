import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';


const Event = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        dateTime: '',
        notes: '',
        sendReminder: false,
        reminderTime: ''  
    });
    const [allowedToEdit, setAllowedToEdit] = useState(false);
    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:4000/api/events/get/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEvent(response.data.event);
                setAllowedToEdit(response.data.allowEditing);
                setFormData({
                    title: response.data.title,
                    dateTime: response.data.dateTime.slice(0, 16), // format for datetime-local input
                    notes: response.data.notes,
                    sendReminder: response.data.reminder?.sendReminder || false,
                    reminderTime: response.data.reminder?.reminderTime 
                        ? response.data.reminder.reminderTime.slice(0, 16)
                        : ''
                });
            } catch (err) {
                setError('Failed to fetch event details');
                toast.error(err.response?.data?.message || 'Failed to fetch event details');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedEvent = {
                title: formData.title.trim(),
                dateTime: new Date(formData.dateTime).toISOString(),
                notes: formData.notes.trim(),
                reminder: {
                    sendReminder: formData.sendReminder,
                    reminderTime: formData.sendReminder ? new Date(formData.reminderTime).toISOString() : null
                }
            };

            await axios.put(`http://localhost:4000/api/events/update/${eventId}`, updatedEvent, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            toast.success("Event updated successfully");
            setIsEditing(false);
            setEvent(prev => ({ ...prev, ...updatedEvent }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch event details');
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!event) {
        return <div>Event not found.</div>
    }

    return (
        <div className="p-4">
            {!isEditing ? (
                <>
                    <div>Title: {event.title}</div>
                    <div>Created by: {event.createdBy.name}</div>
                    <div><img src={event.createdBy.profilePic} className='h-10' alt="" /></div>
                    <div>Group: {event.Group}</div>
                    <div>Event date and time: {new Date(event.dateTime).toLocaleString()}</div>
                    <div>Notes: {event.notes}</div>
                    <div>Reminder: {event.reminder?.sendReminder ? 
                        `Set for ${new Date(event.reminder.reminderTime).toLocaleString()}` : 'No reminder set'}
                    </div>

                    {new Date(event.dateTime) > new Date()  && allowedToEdit && <button 
                        onClick={() => {
                            setIsEditing(true)}} 
                        className="mt-4 p-2 bg-blue-500 text-white rounded"
                    >
                        Edit Event
                    </button>}

                    <div className="participants-list mt-6">
                        <h3>Participants:</h3>
                        {event.participants.map((participant) => (
                            <div key={participant._id} className="participant-card">
                                <img
                                    src={participant.profilePic}
                                    alt={participant.name}
                                    className="participant-image"
                                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                                />
                                <div className="participant-name">{participant.name}</div>
                            </div>
                        ))}
                    </div>

                    <div className="movies-list mt-6">
                        <h3>Suggested Movies:</h3>
                        {event.suggestedMovies.map((movie) => (
                            <div key={movie._id} className="movie-card">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="movie-poster"
                                    style={{ width: '150px', height: '225px', borderRadius: '10px' }}
                                />
                                <div className="movie-info">
                                    <h4>{movie.title} ({movie.year})</h4>
                                    <p>Rating: {movie.rating}</p>
                                    <p>Genres: {movie.genres.join(', ')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Title:</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            className="border p-2 w-full" 
                        />
                    </div>

                    <div>
                        <label>Date and Time:</label>
                        <input 
                            type="datetime-local" 
                            name="dateTime" 
                            value={formData.dateTime} 
                            onChange={handleChange} 
                            className="border p-2 w-full" 
                        />
                    </div>

                    <div>
                        <label>Notes:</label>
                        <textarea 
                            name="notes" 
                            value={formData.notes} 
                            onChange={handleChange} 
                            className="border p-2 w-full" 
                        />
                    </div>

                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                name="sendReminder" 
                                checked={formData.sendReminder} 
                                onChange={handleChange} 
                            />
                            Send Reminder
                        </label>
                    </div>

                    {formData.sendReminder && (
                        <div>
                            <label>Reminder Time:</label>
                            <input 
                                type="datetime-local" 
                                name="reminderTime" 
                                value={formData.reminderTime} 
                                onChange={handleChange} 
                                className="border p-2 w-full" 
                            />
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button type="submit" className="bg-green-500 text-white p-2 rounded">Save</button>
                        <button 
                            type="button" 
                            onClick={() => setIsEditing(false)} 
                            className="bg-gray-500 text-white p-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default Event
