import { candidate_stream } from 'common/global/streams'
import { Consumer } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class CandidateCreatedConsumer extends Consumer {
	private static _instance: CandidateCreatedConsumer = new CandidateCreatedConsumer()

	protected stream = candidate_stream
	readonly subject = Subjects.CandidateCreated
	readonly durable_name = 'Vacancy:CandidateCreated'
	readonly queue_group = 'queue'

	static get instance() {
		return this._instance
	}
}

const instance = CandidateCreatedConsumer.instance
export { instance as candidate_created_consumer }
