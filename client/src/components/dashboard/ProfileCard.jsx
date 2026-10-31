import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';

/**
 * Lets the logged-in user view and update fullName, phone, and
 * profileImage (URL). Deliberately scoped to just those three fields
 * per the Phase 2 spec - no course/enrollment data belongs here.
 */
export default function ProfileCard() {
  const { user, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      profileImage: user?.profileImage || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      const message = err.response?.data?.message || 'Could not update profile. Please try again.';
      toast.error(message);
    }
  };

  return (
    <Card hoverable={false}>
      <h5 className="mb-3">My Profile</h5>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full Name"
          error={errors.fullName}
          {...register('fullName', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Full name must be at least 2 characters' },
          })}
        />
        <Input
          label="Phone Number"
          type="tel"
          error={errors.phone}
          {...register('phone', {
            pattern: { value: /^[+]?[0-9]{10,15}$/, message: 'Enter a valid phone number (10-15 digits)' },
          })}
        />
        <Input
          label="Profile Image URL"
          placeholder="https://..."
          error={errors.profileImage}
          {...register('profileImage')}
        />
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={!isDirty}>
          Save Changes
        </Button>
      </form>
    </Card>
  );
}
