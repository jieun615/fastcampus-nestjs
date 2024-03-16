import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AnalyticsModule } from './analytics/analytics.module';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './config/postgres.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          database: configService.get('postgres.database'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          autoLoadEntities: true,
        };
        if (configService.get('STAGE') === 'local') {
          console.info('Sync postgres');
          obj = Object.assign(obj, {
            synchronize: true,
            logging: true,
          });
        }
        return obj;
      },
    }),
    AuthModule,
    UserModule,
    VideoModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
