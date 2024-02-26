using UnityEngine;

public class CameraMovement : MonoBehaviour
{
    public float speed = 5.0f; // Speed of the camera movement

    void Update()
    {
        float horizontalInput = Input.GetAxis("Horizontal"); // A/D keys
        float verticalInput = Input.GetAxis("Vertical"); // W/S keys

        // Move the camera forward/backward
        transform.Translate(Vector3.forward * verticalInput * speed * Time.deltaTime);

        // Move the camera left/right
        transform.Translate(Vector3.right * horizontalInput * speed * Time.deltaTime);
    }
}