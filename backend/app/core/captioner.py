from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch

class CaptionGenerator:
    def __init__(self, model_name="Salesforce/blip-image-captioning-large"):
        self.processor = BlipProcessor.from_pretrained(model_name)
        self.model = BlipForConditionalGeneration.from_pretrained(model_name)
        self.model.eval()

    def generate_caption(self, image_path: str, num_captions: int = 5):
        """
        Generate multiple captions for an image using BLIP.
        Returns a list of captions.
        """
        image = Image.open(image_path).convert("RGB")
        inputs = self.processor(image, return_tensors="pt")

        captions = []
        for i in range(num_captions):
            # Vary the generation to get different captions
            with torch.no_grad():
                out = self.model.generate(
                    **inputs,
                    max_length=50,
                    num_beams=5,
                    do_sample=True,
                    temperature=0.7 + i * 0.1,  # Vary temperature for diversity
                    top_p=0.9,
                    repetition_penalty=1.2
                )
            caption = self.processor.decode(out[0], skip_special_tokens=True)
            captions.append(caption.strip())

        return captions
