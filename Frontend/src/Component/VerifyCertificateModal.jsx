import React, { useState } from 'react';
import axios from 'axios';

const VerifyCertificateModal = ({ isOpen, onClose }) => {
    const [certificateId, setCertificateId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleIdChange = (event) => {
        setCertificateId(event.target.value);
    };

    const handleVerify = async () => {
        if (!certificateId.trim()) {
            setError('Please enter a Certificate ID.');
            return;
        }

        setLoading(true);
        setError('');
        setVerificationResult(null);

        try {
            const response = await axios.post('https://work-cast.vercel.app/api/v1/certificates/verify-certificate', 
            {
                transactionId: certificateId
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setVerificationResult(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please check the ID and try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const resetVerification = () => {
        setCertificateId('');
        setVerificationResult(null);
        setError('');
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-75">
            <div className="p-8 m-4 w-full max-w-lg text-white rounded-lg shadow-2xl bg-zinc-900">
                <h2 className="mb-4 text-2xl font-bold">Verify Certificate</h2>
                
                {!verificationResult ? (
                    <div>
                        <input
                            type="text"
                            value={certificateId}
                            onChange={handleIdChange}
                            placeholder="Enter Certificate Transaction ID"
                            className="p-2 w-full text-white bg-black rounded border border-gray-700"
                        />
                        {error && <p className="mt-2 text-red-500">{error}</p>}
                        <div className="flex justify-end mt-6">
                            <button onClick={onClose} className="px-4 py-2 mr-2 font-bold text-white bg-gray-600 rounded hover:bg-gray-700">
                                Cancel
                            </button>
                            <button onClick={handleVerify} className="px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold text-green-400">Certificate Verified!</h3>
                        <div className="mt-4 space-y-2 text-sm">
                            <p><strong>Student:</strong> {verificationResult.studentName}</p>
                            <p><strong>Course:</strong> {verificationResult.courseName}</p>
                            <p><strong>Institution:</strong> {verificationResult.institution}</p>
                            <p><strong>Grade:</strong> {verificationResult.grade}</p>
                            <a href={`https://explorer.solana.com/tx/${verificationResult.transactionId}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                View on Solana Explorer
                            </a>
                        </div>
                        <div className="flex justify-end mt-6">
                           <button onClick={resetVerification} className="px-4 py-2 mr-2 font-bold text-white bg-gray-600 rounded hover:bg-gray-700">
                                Verify Another
                            </button>
                            <button onClick={onClose} className="px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyCertificateModal;
