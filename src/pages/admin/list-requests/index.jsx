import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './list-requests.module.css';
import SupaBaseAdminAPI from '@/api/supabase-admin';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const router = useRouter();

  const supabaseApi = new SupaBaseAdminAPI();

  useEffect(() => {
    fetchUserRequests();
  }, []);

  async function fetchUserRequests() {
    // TODO: Fetch requests from the database
    setRequests(await supabaseApi.getUserRequests());
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
                <th>Type</th>
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
                  <td>{request.first_name} {request.last_lame}</td>
                  <td>{request.gender}</td>
                  <td>{request.is_editing? "Updating" : "New"}</td>
                  <td>
                    {new Date(request.date_created).toLocaleDateString('en-GB', {
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
