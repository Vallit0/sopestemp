import PropTypes from 'prop-types';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

export function PicturesGridView({ data }) {
  return (
    <div>
      {Object.keys(data).map((albumName) => (
        <div key={albumName} className="mb-3">
          <h5>{albumName}</h5>
          <Row>
            {data[albumName].map((photo, photoIndex) => (
              <Col key={photoIndex} xs={6} md={4} className="mb-2">
                <img src={photo.url} alt={`${albumName} ${photoIndex + 1}`} className="img-thumbnail" />
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
}

PicturesGridView.propTypes = {
  data: PropTypes.object.isRequired,
};
