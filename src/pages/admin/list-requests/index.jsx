import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './list-requests.module.css';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchUserRequests();
  }, []);

  function fetchUserRequests() {
    // TODO: Fetch requests from the database
    setRequests([
      { id: '110', firstName: 'John', lastName: 'Doe', requestedAt: '2024-02-04' },
      { id: '1120', firstName: 'Jane', lastName: 'Smith', requestedAt: '2024-01-29' },
    ]);
  }

  function handleRequestClick(userId) {
    router.push(`/admin/review-request/${userId}`);
  }

  return (
    <div className={styles.container}>
      <h2>User Requests</h2>
      <table className={styles.requestTable}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date Requested</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} onClick={() => handleRequestClick(request.id)} className={styles.clickableRow}>
              <td>{request.firstName}</td>
              <td>{request.lastName}</td>
              <td>{request.requestedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
