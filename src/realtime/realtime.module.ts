import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  providers: [RealtimeGateway],
  exports: [RealtimeGateway], // 👈 imprescindible para inyectarlo en otros módulos
})
export class RealtimeModule {}
