import torch
import open_clip
from PIL import Image
import numpy as np

class CLIPEmbedder:
    def __init__(self, model_name="ViT-B/32"):
        self.model, _, self.preprocess = open_clip.create_model_and_transforms(model_name, pretrained="openai")
        self.tokenizer = open_clip.get_tokenizer(model_name)
        self.model.eval()

    def embed_text(self, text: str):
        tokens = self.tokenizer([text])
        with torch.no_grad():
            text_features = self.model.encode_text(tokens)
        text_features = text_features / text_features.norm(dim=-1, keepdim=True)
        return text_features.cpu().numpy().astype(np.float32)

    def embed_image(self, image_path: str):
        image = self.preprocess(Image.open(image_path)).unsqueeze(0)
        with torch.no_grad():
            image_features = self.model.encode_image(image)
        image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        return image_features.cpu().numpy().astype(np.float32)
