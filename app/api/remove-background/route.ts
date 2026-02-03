import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert file to base64 data URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/png';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Call fal.ai BiRefNet for background removal
    const falResponse = await fetch('https://fal.run/fal-ai/birefnet', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: dataUrl }),
    });

    if (!falResponse.ok) {
      const errorText = await falResponse.text();
      console.error('fal.ai error:', errorText);
      return NextResponse.json(
        { error: 'Background removal failed' },
        { status: 500 }
      );
    }

    const result = await falResponse.json();

    // fal.ai returns { image: { url: "..." } }
    return NextResponse.json({ imageUrl: result.image.url });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
