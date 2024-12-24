import React from "react";
import { Modal, TextInput, Button } from "flowbite-react";

export default function UsePointModal({ show, onClose, onUsePoint }) {
    const [point, setPoint] = React.useState(0);

    const handleSubmit = (event) => {
        event.preventDefault();
        onUsePoint(point);
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose}>
            <Modal.Header>ใช้คะแนน</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        type="number"
                        value={point}
                        onChange={(event) => setPoint(event.target.value)}
                        placeholder="จำนวนคะแนน"
                        required
                    />
                    <Button type="submit">ใช้คะแนน</Button>
                </form>
            </Modal.Body>
        </Modal>
    );
}
