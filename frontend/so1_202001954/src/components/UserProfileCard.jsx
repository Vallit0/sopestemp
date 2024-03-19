import PropTypes from 'prop-types';
import {
    MDBCard,
    MDBCardBody,
    MDBCardImage,

} from 'mdb-react-ui-kit';

export function UserProfileCard({ userProfilePicture, userFullName }) {

    UserProfileCard.propTypes = {
        userProfilePicture: PropTypes.string.isRequired,
        userFullName: PropTypes.string.isRequired,
    };


    return (
        <>
            <MDBCard className="mb-4" style={{ maxWidth: '500px' }}>
                <MDBCardBody className="text-center">
                    <MDBCardImage
                        src={userProfilePicture}
                        alt="avatar"
                        className="rounded-circle"
                        style={{ width: '150px' }}
                        fluid />
                    <h4 className="mt-2">{userFullName}</h4>
                </MDBCardBody>
            </MDBCard>
        </>
    )
}