import { UserCard } from '@/components/user-card'
import { IdentityCard } from '@/components/id-card'

function page() {
  return (
    <div>
      <UserCard name="John Doe" email="john.doe@example.com" photoUrl="/path/to/photo.jpg" level={5} />
      <div className="flex gap-4 mt-4">
        <UserCard name="John Doe" email="john.doe@example.com" photoUrl="/path/to/photo.jpg" level={5} />
        <UserCard name="John Doe" email="john.doe@example.com" photoUrl="/path/to/photo.jpg" level={5} />
      </div>
      <div className="p-6 flex flex-col gap-6">
        <IdentityCard
          name="Amit Kumar"
          email="amit@example.com"
          photoUrl="/images/amit.jpg"
          idNumber="AA-12345"
          level={2}
        />
        <IdentityCard
          name="Priya Sharma"
          email="priya@example.com"
          photoUrl="/images/priya.jpg"
          idNumber="AA-67890"
          level={3}
        />
      </div>

    </div>
  )
}

export default page