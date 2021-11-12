import { db, storage } from '../firebase';

export const saveOrChangeImageToDatabase = async (
	images?: string[],
	requestId?: string
) => {
	try {
		const data: string[] = [];
		if (!requestId) return;

		if (images!.length > 0) {
			images!.map(async (image) => {
				const id = image.split('ImagePicker')[1].split('.')[0];
				const ext = image.split('.').pop();
				const filename = id + '.' + ext;
				const response = await fetch(image);
				const blob = await response.blob();
				const uploadTask = storage
					.ref(`requestImages/${requestId}/${filename}`)
					.put(blob, { contentType: 'image/jpeg' });

				uploadTask.on(
					'state_changed',
					(s) => {
						let progress = (s.bytesTransferred / s.totalBytes) * 100;
					},
					(error) => {
						console.log('Error uploading images', error);
					},
					async () => {
						try {
							const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();

							data.push(imageUrl);

							await db
								.collection('requests')
								.doc(requestId)
								.update({ images: data });

							return data;
						} catch (error) {
							console.log('ERR', error);
						}
					}
				);
			});
		} else {
			return;
		}

		//   if (user.imageUrl) {
		//     const ref = storage.ref(`profile/${filename}`);
		//     if (ref) {
		//       await ref.delete();
		//     }
		//   }
	} catch (error) {
		console.log('Error from saving image', error);
	}
};
