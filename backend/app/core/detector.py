from ultralytics import YOLO

class ObjectDetector:
    def __init__(self, model_path):
        self.model = YOLO(model_path)

    def detect(self, image_path):
        results = self.model(image_path)
        objects = []
        for box in results[0].boxes:
            label = results[0].names[int(box.cls)]
            objects.append(label)
        return objects
