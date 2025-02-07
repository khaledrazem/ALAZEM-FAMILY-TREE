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
      { id: '110', firstName: 'John', lastName: 'Doe', gender: 'M', requestedAt: '2024-02-04' },
      { id: '1120', firstName: 'Jane', lastName: 'Smith', gender: 'F', requestedAt: '2024-01-29' },
      { id: '1121', firstName: 'Alex', lastName: 'Johnson', gender: 'O', requestedAt: '2024-01-30' },
    ]);
  }

  function handleRequestClick(userId) {
    router.push(`/admin/review-request/${userId}`);
  }

  function getRowClassName(gender) {
    switch(gender) {
      case 'M': return styles.male;
      case 'F': return styles.female;
      default: return styles.other;
    }
  }

  return (
    <div className={styles.container}>
      <h2>User Requests</h2>
      {requests.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.requestsTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Request Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className={`${styles.requestRow} ${getRowClassName(request.gender)}`}
                  onClick={() => handleRequestClick(request.id)}
                >
                  <td>{request.firstName} {request.lastName}</td>
                  <td>{request.gender}</td>
                  <td>
                    {new Date(request.requestedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h2>No Requests Found</h2>
          <p>There are currently no user requests to review.</p>
        </div>
      )}
    </div>
  );
}
