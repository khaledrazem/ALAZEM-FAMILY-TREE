import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './review-request.module.css';

export default function ReviewRequest() {
  const router = useRouter();
  const { userId } = router.query;
  const [request, setRequest] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchRequestDetails();
    }
  }, [userId]);

  const fetchRequestDetails = () => {
    // TODO: Fetch request details from the database
    setRequest({
      data: {
        avatar: "https://example.com/avatar.jpg",
        firstName: "John",
        lastName: "Doe",
        birthday: "1990-05-15",
        gender: "M",
        maritalStatus: "Married",
        emailAddress: "john.doe@example.com",
        publicEmail: true,
        gallaryPhotos: [
          "https://dummyimage.com/16:9x1080/",
          "https://dummyimage.com/16:9x720/"
        ],
        identityDocument:   "https://dummyimage.com/16:9x1080/",
        spouse: {
          id: "110",
          data: {
            firstName: "Jane",
            lastName: "Doe",
            birthday: 1992
          }
        }
      },
      status: "pending",
      requestedAt: "2024-02-04"
    });
  };

  const handleApprove = async () => {
    // TODO: Update request status to approved in the database
    console.log('Approving request:', userId);
    router.push('/admin/list-requests');
  };

  const handleDecline = async () => {
    // TODO: Update request status to rejected in the database
    console.log('Declining request:', userId);
    router.push('/admin/list-requests');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!request) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Review Request</h1>
        <div className={styles.status}>
          Status: <span className={styles[request.status]}>{request.status}</span>
        </div>
        <div className={styles.date}>
          Requested on: {formatDate(request.requestedAt)}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.avatarSection}>
            <img 
              src={request.data.avatar} 
              alt="Profile" 
              className={styles.avatar}
            />
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoGroup}>
              <h2>Personal Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>First Name</label>
                  <div>{request.data.firstName}</div>
                </div>
                <div className={styles.infoItem}>
                  <label>Last Name</label>
                  <div>{request.data.lastName}</div>
                </div>
                <div className={styles.infoItem}>
                  <label>Date of Birth</label>
                  <div>{formatDate(request.data.birthday)}</div>
                </div>
                <div className={styles.infoItem}>
                  <label>Gender</label>
                  <div>{request.data.gender === 'M' ? 'Male' : 'Female'}</div>
                </div>
                <div className={styles.infoItem}>
                  <label>Marital Status</label>
                  <div>{request.data.maritalStatus}</div>
                </div>
                <div className={styles.infoItem}>
                  <label>Email</label>
                  <div>{request.data.emailAddress}</div>
                </div>
              </div>
            </div>

            <div className={styles.infoGroup}>
              <h2>Family Information</h2>
              <div className={styles.infoGrid}>
                {request.data.spouse && (
                  <div className={styles.infoItem}>
                    <label>Spouse</label>
                    <div>{`${request.data.spouse.data.firstName} ${request.data.spouse.data.lastName}`}</div>
                  </div>
                )}
                {request.data.father && (
                  <div className={styles.infoItem}>
                    <label>Father</label>
                    <div>{`${request.data.father.data.firstName} ${request.data.father.data.lastName}`}</div>
                  </div>
                )}
                {request.data.mother && (
                  <div className={styles.infoItem}>
                    <label>Mother</label>
                    <div>{`${request.data.mother.data.firstName} ${request.data.mother.data.lastName}`}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.documentsSection}>
          <h2>Identity Document</h2>
          <div className={styles.documentImage}>
            <img
              src={request.data.identityDocument}
              alt="Identity Document"
            />
          </div>
        </div>

        <div className={styles.gallerySection}>
          <h2>Gallery Photos</h2>
          <div className={styles.gallery}>
            {request.data.gallaryPhotos.map((photo, index) => (
              <div key={index} className={styles.galleryItem}>
                <img src={photo} alt={`Gallery photo ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={() => router.back()} className={styles.backButton}>
          Back
        </button>
        <div className={styles.actionButtons}>
          <button 
            onClick={handleDecline} 
            className={`${styles.button} ${styles.declineButton}`}
          >
            Decline
          </button>
          <button 
            onClick={handleApprove} 
            className={`${styles.button} ${styles.approveButton}`}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
